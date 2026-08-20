import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint


class RestaurantMenuFlow(Document):
	def validate(self):
		groups = set()

		for step in self.steps:
			minimum = cint(step.min_selections)
			maximum = cint(step.max_selections)

			if minimum < 0 or maximum < 0:
				frappe.throw(_("Selection limits cannot be negative in row {0}").format(step.idx))

			if maximum and minimum > maximum:
				frappe.throw(
					_("Minimum Selections cannot exceed Maximum Selections in row {0}").format(step.idx)
				)

			if step.modifier_group in groups:
				frappe.throw(
					_("Modifier Group {0} can only appear once in a menu flow").format(
						frappe.bold(step.modifier_group)
					)
				)

			groups.add(step.modifier_group)
