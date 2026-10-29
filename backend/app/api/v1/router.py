"""API v1 router aggregation."""

from __future__ import annotations

from starlette.routing import Route, Router

from app.api.v1.routes import (
    admin,
    analytics,
    appointments,
    auth,
    billing,
    catalog,
    chat,
    dashboard,
    documents,
    intake,
)

API_V1_PREFIX = "/api/v1"

#: Friendly collection aliases → catalog kind.
KIND_ALIASES: tuple[tuple[str, str], ...] = (
    ("service", "services"),
    ("professional", "professionals"),
    ("condition", "conditions"),
    ("discipline", "disciplines"),
    ("faq", "faqs"),
    ("blog_post", "blog"),
    ("location", "locations"),
    ("pricing_package", "pricing"),
)


def build_v1_router() -> Router:
    routes: list[Route] = [
        # Auth
        Route("/auth/otp/request", auth.otp_request, methods=["POST"]),
        Route("/auth/otp/verify", auth.otp_verify, methods=["POST"]),
        Route("/auth/staff/login", auth.staff_login, methods=["POST"]),
        Route("/auth/token/refresh", auth.token_refresh, methods=["POST"]),
        Route("/auth/logout", auth.logout, methods=["POST"]),
        Route("/auth/me", auth.me, methods=["GET"]),
        # Catalog (generic + aliases)
        Route("/catalog", catalog.list_all, methods=["GET"]),
        Route("/catalog/{kind}", catalog.list_kind, methods=["GET"]),
        Route("/catalog/{kind}/{slug}", catalog.get_item, methods=["GET"]),
        # Intake (public submissions)
        Route("/intake/appointment-requests", intake.create_appointment_request, methods=["POST"]),
        Route("/intake/enquiries", intake.create_enquiry, methods=["POST"]),
        Route("/intake/referrals", intake.create_referral, methods=["POST"]),
        # Scheduling
        Route("/availability", appointments.list_availability, methods=["GET"]),
        Route("/appointments", appointments.create_appointment, methods=["POST"]),
        Route("/appointments", appointments.list_appointments, methods=["GET"]),
        Route("/appointments/{reference}", appointments.get_appointment, methods=["GET"]),
        Route(
            "/appointments/{reference}/status",
            appointments.update_appointment_status,
            methods=["PATCH"],
        ),
        Route(
            "/appointments/{reference}/cancel",
            appointments.cancel_appointment,
            methods=["POST"],
        ),
        # Billing
        Route("/billing/invoices", billing.list_invoices, methods=["GET"]),
        Route("/billing/invoices", billing.create_invoice, methods=["POST"]),
        Route("/billing/invoices/{invoice_id}", billing.get_invoice, methods=["GET"]),
        Route("/billing/payments", billing.list_payments, methods=["GET"]),
        Route("/billing/payments", billing.record_payment, methods=["POST"]),
        Route("/billing/payments/razorpay/order", billing.create_checkout, methods=["POST"]),
        Route("/billing/payments/razorpay/verify", billing.verify_checkout, methods=["POST"]),
        Route("/billing/refunds", billing.create_refund, methods=["POST"]),
        # Payment webhooks (signature-verified, no auth header)
        Route("/webhooks/razorpay", billing.razorpay_webhook, methods=["POST"]),
        # Documents (prescription/report uploads)
        Route("/documents", documents.upload_document, methods=["POST"]),
        Route("/documents", documents.list_documents, methods=["GET"]),
        Route("/documents/{document_id}", documents.download_document, methods=["GET"]),
        # Chat (patient ↔ clinic)
        Route("/chat/threads", chat.create_thread, methods=["POST"]),
        Route("/chat/threads", chat.list_threads, methods=["GET"]),
        Route("/chat/threads/{thread_id}/messages", chat.list_messages, methods=["GET"]),
        Route("/chat/threads/{thread_id}/messages", chat.post_message, methods=["POST"]),
        Route("/chat/threads/{thread_id}/read", chat.mark_thread_read, methods=["POST"]),
        # Analytics
        Route("/analytics/events", analytics.record_event, methods=["POST"]),
        Route("/analytics/seo", analytics.create_seo_snapshot, methods=["POST"]),
        Route("/analytics/seo", analytics.list_seo_snapshots, methods=["GET"]),
        # Dashboards
        Route("/dashboard/patient", dashboard.patient_dashboard, methods=["GET"]),
        Route("/dashboard/admin", dashboard.admin_dashboard, methods=["GET"]),
        # Admin
        Route("/admin/intake/{kind}", admin.list_intake, methods=["GET"]),
        Route("/admin/intake/{kind}/{record_id}", admin.update_intake_status, methods=["PATCH"]),
        Route("/admin/audit-log", admin.list_audit_log, methods=["GET"]),
        Route("/admin/users", admin.list_users, methods=["GET"]),
        Route("/admin/users", admin.create_user, methods=["POST"]),
        Route("/admin/users/{user_id}", admin.update_user, methods=["PATCH"]),
        # Staff-accessible patient list
        Route("/staff/patients", admin.list_patients, methods=["GET"]),
        # Admin catalog writes
        Route("/admin/catalog/{kind}/{slug}", catalog.upsert_item, methods=["PUT"]),
        Route("/admin/catalog/{kind}/{slug}", catalog.delete_item, methods=["DELETE"]),
    ]

    for kind, alias in KIND_ALIASES:
        routes.append(Route(f"/{alias}", catalog.make_list_handler(kind), methods=["GET"]))
        routes.append(Route(f"/{alias}/{{slug}}", catalog.make_get_handler(kind), methods=["GET"]))

    return Router(routes)
