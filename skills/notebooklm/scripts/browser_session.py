#!/usr/bin/env python3
"""
Browser Session Management for NotebookLM
Individual browser session for persistent NotebookLM conversations
Based on the original NotebookLM API implementation
"""

import time
import sys
from typing import Any, Dict, Optional
from pathlib import Path

from patchright.sync_api import BrowserContext, Page

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from browser_utils import StealthUtils


class BrowserSession:
    """
    Represents a single persistent browser session for NotebookLM

    Each session gets its own Page (tab) within a shared BrowserContext,
    allowing for contextual conversations where NotebookLM remembers
    previous messages.
    """

    def __init__(self, session_id: str, context: BrowserContext, notebook_url: str):
        """
        Initialize a new browser session

        Args:
            session_id: Unique identifier for this session
            context: Browser context (shared or dedicated)
            notebook_url: Target NotebookLM URL for this session
        """
        self.id = session_id
        self.created_at = time.time()
        self.last_activity = time.time()
        self.message_count = 0
        self.notebook_url = notebook_url
        self.context = context
        self.page = None
        self.stealth = StealthUtils()

        # Initialize the session
        self._initialize()

    def _initialize(self):
        """Initialize the browser session and navigate to NotebookLM"""
        print(f"🚀 Creating session {self.id}...")

        # Create new page (tab) in context
        self.page = self.context.new_page()
        print(f"  🌐 Navigating to NotebookLM...")

        try:
            # Navigate to notebook
            self.page.goto(self.notebook_url, wait_until="domcontentloaded", timeout=30000)

            # Check if login is needed
            if "accounts.google.com" in self.page.url:
                raise RuntimeError("Authentication required. Please run auth_manager.py setup first.")

            # Wait for page to be ready
            self._wait_for_ready()

            # Simulate human inspection
            self.stealth.random_mouse_movement(self.page)
            self.stealth.random_delay(300, 600)

            print(f"✅ Session {self.id} ready!")

        except Exception as e:
            print(f"❌ Failed to initialize session: {e}")
            if self.page:
                self.page.close()
            raise

    def _wait_for_ready(self):
        """Wait for NotebookLM page to be ready"""
        try:
            # Wait for chat input
            self.page.wait_for_selector("textarea.query-box-input", timeout=10000, state="visible")
        except Exception:
            # Try alternative selector
            self.page.wait_for_selector('textarea[aria-label="Feld für Anfragen"]', timeout=5000, state="visible")

    def ask(self, question: str) -> Dict[str, Any]:
        """
        Ask a question in this session

        Args:
            question: The question to ask

        Returns:
            Dict with status, question, answer, session_id
        """
        try:
            self.last_activity = time.time()
            self.message_count += 1

            print(f"💬 [{self.id}] Asking: {question}")

            # Snapshot current answer to detect new response
            previous_answer = self._snapshot_latest_response()

            # Find chat input
            chat_input_selector = "textarea.query-box-input"
            try:
                self.page.wait_for_selector(chat_input_selector, timeout=5000, state="visible")
            except Exception:
                chat_input_selector = 'textarea[aria-label="Feld für Anfragen"]'
                self.page.wait_for_selector(chat_input_selector, timeout=5000, state="visible")

            # Click and type with human-like behavior
            self.stealth.realistic_click(self.page, chat_input_selector)
            self.stealth.human_type(self.page, chat_input_selector, question)

            # Small pause before submit
            self.stealth.random_delay(300, 800)

            # Submit
            self.page.keyboard.press("Enter")

            # Wait for response
            print("  ⏳ Waiting for response...")
            self.stealth.random_delay(1500, 3000)

            # Get new answer
            answer = self._wait_for_latest_answer(previous_answer)

            if not answer:
                raise Exception("Empty response from NotebookLM")

            print(f"  ✅ Got response ({len(answer)} chars)")

            return {
                "status": "success",
                "question": question,
                "answer": answer,
                "session_id": self.id,
                "notebook_url": self.notebook_url
            }

        except Exception as e:
            print(f"  ❌ Error: {e}")
            return {
                "status": "error",
                "question": question,
                "error": str(e),
                "session_id": self.id
            }

    def _snapshot_latest_response(self) -> Optional[str]:
        """Get the current latest response text"""
        try:
            # Use correct NotebookLM selector
            responses = self.page.query_selector_all(".to-user-container .message-text-content")
            if responses:
                return responses[-1].inner_text()
        except Exception:
            pass
        return None

    def _wait_for_latest_answer(self, previous_answer: Optional[str], timeout: int = 120) -> str:
        """Wait for and extract the new answer"""
        start_time = time.time()
        last_candidate = None
        stable_count = 0

        while time.time() - start_time < timeout:
            # Check if NotebookLM is still thinking (most reliable indicator)
            try:
                thinking_element = self.page.query_selector('div.thinking-message')
                if thinking_element and thinking_element.is_visible():
                    time.sleep(0.5)
                    continue
            except Exception:
                pass

            try:
                # Use correct NotebookLM selector
                responses = self.page.query_selector_all(".to-user-container .message-text-content")

                if responses:
                    latest_text = responses[-1].inner_text().strip()

                    # Check if it's a new response
                    if latest_text and latest_text != previous_answer:
                        # Check if text is stable (3 consecutive polls)
                        if latest_text == last_candidate:
                            stable_count += 1
                            if stable_count >= 3:
                                return latest_text
                        else:
                            stable_count = 1
                            last_candidate = latest_text

            except Exception:
                pass

            time.sleep(0.5)

        raise TimeoutError(f"No response received within {timeout} seconds")

    def reset(self):
        """Reset the chat by reloading the page"""
        print(f"🔄 Resetting session {self.id}...")

        self.page.reload(wait_until="domcontentloaded")
        self._wait_for_ready()

        previous_count = self.message_count
        self.message_count = 0
        self.last_activity = time.time()

        print(f"✅ Session reset (cleared {previous_count} messages)")
        return previous_count

    def close(self):
        """Close this session and clean up resources"""
        print(f"🛑 Closing session {self.id}...")

        if self.page:
            try:
                self.page.close()
            except Exception as e:
                print(f"  ⚠️ Error closing page: {e}")

        print(f"✅ Session {self.id} closed")

    def get_info(self) -> Dict[str, Any]:
        """Get information about this session"""
        return {
            "id": self.id,
            "created_at": self.created_at,
            "last_activity": self.last_activity,
            "age_seconds": time.time() - self.created_at,
            "inactive_seconds": time.time() - self.last_activity,
            "message_count": self.message_count,
            "notebook_url": self.notebook_url
        }

    def is_expired(self, timeout_seconds: int = 900) -> bool:
        """Check if session has expired (default: 15 minutes)"""
        return (time.time() - self.last_activity) > timeout_seconds


if __name__ == "__main__":
    # Example usage
    print("Browser Session Module - Use ask_question.py for main interface")
    print("This module provides low-level browser session management.")