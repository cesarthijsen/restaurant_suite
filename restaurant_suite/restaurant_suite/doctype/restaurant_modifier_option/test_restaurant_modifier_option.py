import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import random_string


class TestRestaurantModifierOption(IntegrationTestCase):
	def test_option_belongs_to_group(self):
		group = frappe.get_doc(
			{
				"doctype": "Restaurant Modifier Group",
				"group_name": f"Test Group {random_string(8)}",
				"selection_type": "Single",
			}
		).insert()

		option = frappe.get_doc(
			{
				"doctype": "Restaurant Modifier Option",
				"option_name": f"Test Option {random_string(8)}",
				"modifier_group": group.name,
			}
		).insert()

		self.assertEqual(option.modifier_group, group.name)
