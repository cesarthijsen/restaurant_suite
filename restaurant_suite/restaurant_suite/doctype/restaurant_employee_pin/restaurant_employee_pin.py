import re

import frappe
from frappe.model.document import Document
from werkzeug.security import generate_password_hash


class RestaurantEmployeePIN(Document):
	pass


@frappe.whitelist()
def set_pin(name: str, pin: str):
	credential = frappe.get_doc("Restaurant Employee PIN", name)
	credential.check_permission("write")
	pin = str(pin or "").strip()
	if not re.fullmatch(r"\d{4,8}", pin):
		frappe.throw(frappe._("PIN must contain 4 to 8 digits."))
	credential.pin_hash = generate_password_hash(pin, method="pbkdf2:sha256:600000")
	credential.save()
	return {"employee": credential.employee, "updated": True}
