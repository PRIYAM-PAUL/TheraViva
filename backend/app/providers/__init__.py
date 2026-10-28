"""Pluggable external providers.

Every integration is defined by a small Protocol and selected at runtime from
settings, so the payment gateway, email relay, WhatsApp bridge and SMS sender
can be swapped without touching business logic. All providers default to a
no-cost local/fake implementation.
"""
