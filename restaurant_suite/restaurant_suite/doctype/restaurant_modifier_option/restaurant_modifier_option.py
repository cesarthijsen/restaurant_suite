import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint


class RestaurantModifierOption(Document):
	def validate(self):
		if cint(self.maximum_quantity) < 0:
			frappe.throw(_("Maximum Quantity cannot be negative"))
