# RACO marketing context

This folder holds RACO Manufacturing & Engineering's product marketing context. RACO makes remote monitoring hardware and software for water and wastewater utilities. The ideal customer is a utility operator or superintendent.

- When a marketing skill asks for `.agents/product-marketing.md`, use the file for the product in question instead:
  - RACO Monitoring Center (RMC, the software): `raco/raco-monitoring-center/product-marketing.md`
  - Verbatim Gen2 (the RTU hardware): `raco/verbatim-gen2/product-marketing.md`
  - Both (the full solution): read both files.
- Check `raco/claims-and-evidence.md` before you write any copy. Do not make a claim from its "Do not claim yet" list. Treat any `[VALIDATE]` item as a gap, and ask for it rather than invent it.
- When you update a context file, bump its version, set the date, and add a changelog line, as the product-marketing skill says.
- Keep all RACO work inside `raco/`. Do not edit upstream files in this fork (see `raco/README.md`).
- Style: plain English, no hype, no em dashes.
