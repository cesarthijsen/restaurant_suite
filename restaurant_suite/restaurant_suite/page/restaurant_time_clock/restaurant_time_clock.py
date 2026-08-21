import frappe
from frappe.utils import now_datetime
from werkzeug.security import check_password_hash


@frappe.whitelist()
def clock_with_pin(pin: str):
	frappe.only_for(("System Manager", "HR Manager", "HR User"))
	pin = str(pin or "").strip()
	if not pin.isdigit() or not 4 <= len(pin) <= 8:
		frappe.throw(frappe._("Invalid PIN."))

	credentials = frappe.get_all(
		"Restaurant Employee PIN",
		filters={"enabled": 1},
		fields=["employee", "employee_name", "pin_hash"],
	)
	credential = next(
		(row for row in credentials if row.pin_hash and check_password_hash(row.pin_hash, pin)),
		None,
	)
	if not credential:
		frappe.throw(frappe._("Invalid PIN."))

	latest = frappe.get_all(
		"Employee Checkin",
		filters={"employee": credential.employee},
		fields=["log_type"],
		order_by="time desc, creation desc",
		limit=1,
	)
	log_type = "OUT" if latest and latest[0].log_type == "IN" else "IN"
	checkin_time = now_datetime()
	frappe.get_doc(
		{
			"doctype": "Employee Checkin",
			"employee": credential.employee,
			"log_type": log_type,
			"time": checkin_time,
			"device_id": "Restaurant PIN Clock",
		}
	).insert(ignore_permissions=True)
	return {
		"employee": credential.employee,
		"employee_name": credential.employee_name,
		"log_type": log_type,
		"time": checkin_time,
	}
