import frappe
from frappe.tests import IntegrationTestCase

from restaurant_suite.restaurant_suite.setup import create_ice_cream_starter


class TestIceCreamStarter(IntegrationTestCase):
	def test_starter_is_idempotent(self):
		first = create_ice_cream_starter()
		second = create_ice_cream_starter()

		self.assertEqual(first, second)
		self.assertEqual(
			frappe.db.count(
				"Restaurant Modifier Option",
				filters={"modifier_group": "Scoop Count"},
			),
			3,
		)

		flow = frappe.get_doc("Restaurant Menu Flow", "Ice Cream POS")
		self.assertEqual(
			[step.step_name for step in flow.steps], ["Scoops", "Serving Type", "Flavors", "Toppings"]
		)
		self.assertEqual(flow.steps[2].dynamic_limit_from_step, "Scoops")
