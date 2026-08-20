from frappe.tests.utils import FrappeTestCase

from restaurant_suite.restaurant_suite.page.restaurant_pos.restaurant_pos import (
    get_pos_data,
)
from restaurant_suite.restaurant_suite.setup import create_ice_cream_starter


class TestRestaurantPOS(FrappeTestCase):
    def setUp(self):
        create_ice_cream_starter()

    def test_pos_data_contains_ordered_steps_and_options(self):
        data = get_pos_data()

        self.assertEqual(data["flow_name"], "Ice Cream POS")
        self.assertEqual(
            [step["step_name"] for step in data["steps"]],
            ["Scoops", "Serving Type", "Flavors", "Toppings"],
        )
        self.assertEqual(
            [option["option_name"] for option in data["steps"][0]["options"]],
            ["1 Scoop", "2 Scoops", "3 Scoops"],
        )
        self.assertEqual(data["steps"][2]["dynamic_limit_from_step"], "Scoops")

