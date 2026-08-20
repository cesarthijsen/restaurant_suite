import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint


class RestaurantModifierGroup(Document):
	def validate(self):
		minimum = cint(self.min_selections)
		maximum = cint(self.max_selections)

		if minimum < 0 or maximum < 0:
			frappe.throw(_("Selection limits cannot be negative"))

		if maximum and minimum > maximum:
			frappe.throw(_("Minimum Selections cannot exceed Maximum Selections"))
