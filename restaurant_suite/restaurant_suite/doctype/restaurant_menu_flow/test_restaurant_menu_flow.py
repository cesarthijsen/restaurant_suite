import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import random_string


class TestRestaurantMenuFlow(IntegrationTestCase):
	def test_rejects_duplicate_modifier_groups(self):
		group = frappe.get_doc(
			{
				"doctype": "Restaurant Modifier Group",
				"group_name": f"Flow Group {random_string(8)}",
				"selection_type": "Single",
			}
		).insert()

		flow = frappe.get_doc(
			{
				"doctype": "Restaurant Menu Flow",
				"flow_name": f"Invalid Flow {random_string(8)}",
				"menu_item_code": "TEST-ITEM",
				"steps": [
					{"step_name": "First", "modifier_group": group.name, "sequence": 1},
					{"step_name": "Second", "modifier_group": group.name, "sequence": 2},
				],
			}
		)

		with self.assertRaises(frappe.ValidationError):
			flow.insert()
