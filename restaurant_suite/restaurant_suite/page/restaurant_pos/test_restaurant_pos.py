from frappe.tests.utils import FrappeTestCase

from restaurant_suite.restaurant_suite.page.restaurant_pos.restaurant_pos import get_pos_data
from restaurant_suite.restaurant_suite.setup import create_ice_cream_starter


class TestRestaurantPOS(FrappeTestCase):
	def setUp(self):
		create_ice_cream_starter()

	def test_pos_data_contains_catalog_and_modifier_flow(self):
		data = get_pos_data()

		self.assertEqual(
			[category["name"] for category in data["catalog"]],
			["Scoops", "Pastry", "Fresh & Fruity", "Barista", "Water & Soft Drinks"],
		)
		self.assertEqual(data["catalog"][0]["products"][0]["price_awg"], 9.63)
		self.assertEqual(data["catalog"][2]["products"][0]["price_usd"], 12.59)
		self.assertEqual(
			[step["step_name"] for step in data["flow"]["steps"]],
			["Scoops", "Serving Type", "Flavors", "Toppings"],
		)
		self.assertEqual(
			[option["option_name"] for option in data["flow"]["steps"][0]["options"]],
			["1 Scoop", "2 Scoops", "3 Scoops"],
		)
