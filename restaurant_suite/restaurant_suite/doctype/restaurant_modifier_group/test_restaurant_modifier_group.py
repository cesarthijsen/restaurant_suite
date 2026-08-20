import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import random_string


class TestRestaurantModifierGroup(IntegrationTestCase):
	def test_rejects_inverted_selection_limits(self):
		doc = frappe.get_doc(
			{
				"doctype": "Restaurant Modifier Group",
				"group_name": f"Invalid Limits {random_string(8)}",
				"selection_type": "Multiple",
				"min_selections": 2,
				"max_selections": 1,
			}
		)

		with self.assertRaises(frappe.ValidationError):
			doc.insert()
