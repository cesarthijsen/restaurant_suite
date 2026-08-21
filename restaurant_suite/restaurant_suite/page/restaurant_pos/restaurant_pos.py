import frappe

CATALOG = [
	{
		"name": "Scoops",
		"icon": "🍨",
		"products": [
			{
				"code": "SCOOP-1",
				"name": "1 Scoop in Cup",
				"price_awg": 9.63,
				"price_usd": 5.50,
				"scoop_option": "1 Scoop",
				"icon": "🍨",
			},
			{
				"code": "SCOOP-2",
				"name": "2 Scoops in Cup",
				"price_awg": 14.00,
				"price_usd": 8.50,
				"scoop_option": "2 Scoops",
				"icon": "🍨",
			},
			{
				"code": "SCOOP-3",
				"name": "3 Scoops in Cup",
				"price_awg": 17.06,
				"price_usd": 10.50,
				"scoop_option": "3 Scoops",
				"icon": "🍨",
			},
			{
				"code": "ICE-CREAM-BAR",
				"name": "Ice Cream Bar",
				"price_awg": 10.50,
				"price_usd": 6.00,
				"icon": "🍦",
			},
			{
				"code": "PINT",
				"name": "Pint (1-2 Flavors)",
				"price_awg": 23.65,
				"price_usd": 13.50,
				"icon": "🥄",
			},
			{"code": "TUB-750", "name": "750 ml Tub", "price_awg": 38.50, "price_usd": 22.00, "icon": "🍧"},
		],
	},
	{
		"name": "Ice Cream Bars",
		"icon": "🍫",
		"products": [
			{"code": "BAR-CARAMEL-BROWNIE", "name": "Caramel Brownie Bar", "price_awg": 10.50, "price_usd": 6.00, "icon": "🍫"},
			{"code": "BAR-CARAMEL-ALMOND", "name": "Caramel Almond Bar", "price_awg": 10.50, "price_usd": 6.00, "icon": "🍫"},
			{"code": "BAR-CHOCOLATE-ALMOND", "name": "Chocolate Almond Bar", "price_awg": 10.50, "price_usd": 6.00, "icon": "🍫"},
			{"code": "BAR-MACADAMIA-NUT", "name": "Macadamia Nut Bar", "price_awg": 10.50, "price_usd": 6.00, "icon": "🍫"},
			{"code": "BAR-SALTED-CARAMEL", "name": "Salted Caramel Bar", "price_awg": 10.50, "price_usd": 6.00, "icon": "🍫"},
			{"code": "BAR-STRAWBERRY-CREAM", "name": "Strawberry & Cream Bar", "price_awg": 10.50, "price_usd": 6.00, "icon": "🍓"},
		],
	},
	{
		"name": "Pastry",
		"icon": "🧇",
		"products": [
			{
				"code": "PISTACHIO-WAFFLE",
				"name": "Pistachio Chocolate Waffle",
				"price_awg": 28.00,
				"price_usd": 16.00,
				"icon": "🧇",
			},
			{
				"code": "BANANA-CREPE",
				"name": "Banana Chocolate Crepe",
				"price_awg": 28.00,
				"price_usd": 16.00,
				"icon": "🥞",
			},
			{
				"code": "BANANA-SPLIT",
				"name": "Banana Super Split",
				"price_awg": 28.00,
				"price_usd": 16.00,
				"icon": "🍌",
			},
			{
				"code": "COMBO-1",
				"name": "Waffle/Crepe + 1 Scoop + 2 Toppings",
				"price_awg": 22.75,
				"price_usd": 13.00,
				"icon": "🧇",
			},
			{
				"code": "COMBO-2",
				"name": "Waffle/Crepe + 2 Scoops + 1 Topping",
				"price_awg": 25.40,
				"price_usd": 14.50,
				"icon": "🥞",
			},
			{
				"code": "CARROT-CAKE",
				"name": "Carrot Cake",
				"price_awg": 10.50,
				"price_usd": 6.00,
				"icon": "🍰",
				"demo_price": True,
			},
			{
				"code": "CHOCOLATE-CAKE",
				"name": "Chocolate Cake",
				"price_awg": 10.50,
				"price_usd": 6.00,
				"icon": "🍰",
				"demo_price": True,
			},
			{
				"code": "BROWNIE",
				"name": "Brownie",
				"price_awg": 8.75,
				"price_usd": 5.00,
				"icon": "🍫",
				"demo_price": True,
			},
			{
				"code": "CHOC-CHIP-COOKIE",
				"name": "Chocolate Chip Cookie",
				"price_awg": 6.15,
				"price_usd": 3.50,
				"icon": "🍪",
				"demo_price": True,
			},
		],
	},
	{
		"name": "Fresh & Fruity",
		"icon": "🥤",
		"products": [
			{
				"code": "VIRGIN-PINA-COLADA",
				"name": "Virgin Piña Colada",
				"price_awg": 22.05,
				"price_usd": 12.59,
				"icon": "🍍",
			},
			{
				"code": "RASPBERRY-SIPPER",
				"name": "Raspberry Sorbet Sipper",
				"price_awg": 22.05,
				"price_usd": 12.59,
				"icon": "🍓",
			},
			{
				"code": "VERY-BERRY",
				"name": "Very Berry Smoothie",
				"price_awg": 22.05,
				"price_usd": 12.59,
				"icon": "🫐",
			},
			{
				"code": "VIRGIN-MOJITO",
				"name": "Virgin Mojito",
				"price_awg": 22.05,
				"price_usd": 12.59,
				"icon": "🍋",
			},
			{
				"code": "FRUIT-TEMPTATION",
				"name": "Fruit Temptation",
				"price_awg": 23.78,
				"price_usd": 13.59,
				"icon": "🍹",
			},
		],
	},
	{
		"name": "Barista",
		"icon": "☕",
		"products": [
			{
				"code": "SALTED-CARAMEL-LATTE",
				"name": "Salted Caramel Latte",
				"price_awg": 14.00,
				"price_usd": 8.00,
				"icon": "☕",
			},
			{
				"code": "VANILLA-MATCHA-LATTE",
				"name": "Vanilla Matcha Latte",
				"price_awg": 14.00,
				"price_usd": 8.00,
				"icon": "🍵",
			},
			{
				"code": "TIRAMISU-MOCHA",
				"name": "Tiramisu Mocha",
				"price_awg": 14.00,
				"price_usd": 8.00,
				"icon": "☕",
			},
			{
				"code": "ICE-CREAM-COFFEE",
				"name": "Ice Cream Coffee",
				"price_awg": 14.00,
				"price_usd": 8.00,
				"icon": "🧋",
			},
			{"code": "AFFOGATO", "name": "Affogato", "price_awg": 12.25, "price_usd": 7.00, "icon": "🍨"},
			{"code": "AMERICANO", "name": "Americano", "price_awg": 8.75, "price_usd": 5.00, "icon": "☕"},
			{"code": "CAPPUCCINO", "name": "Cappuccino", "price_awg": 10.50, "price_usd": 6.00, "icon": "☕"},
			{"code": "ESPRESSO", "name": "Espresso", "price_awg": 6.15, "price_usd": 3.50, "icon": "☕"},
			{
				"code": "DOUBLE-ESPRESSO",
				"name": "Double Espresso",
				"price_awg": 8.75,
				"price_usd": 5.00,
				"icon": "☕",
			},
			{"code": "MACCHIATO", "name": "Macchiato", "price_awg": 10.50, "price_usd": 6.00, "icon": "☕"},
			{
				"code": "LATTE-12",
				"name": "Latte (12 oz)",
				"price_awg": 12.25,
				"price_usd": 7.00,
				"icon": "☕",
			},
		],
	},
	{
		"name": "Water & Soft Drinks",
		"icon": "💧",
		"products": [
			{
				"code": "WATER-SMALL",
				"name": "Bottled Water — Small",
				"price_awg": 3.50,
				"price_usd": 2.00,
				"icon": "💧",
				"demo_price": True,
			},
			{
				"code": "WATER-LARGE",
				"name": "Bottled Water — Large",
				"price_awg": 5.25,
				"price_usd": 3.00,
				"icon": "💧",
				"demo_price": True,
			},
			{
				"code": "SOFT-DRINK-CAN",
				"name": "Soft Drink — Can",
				"price_awg": 5.25,
				"price_usd": 3.00,
				"icon": "🥤",
				"demo_price": True,
			},
			{
				"code": "ORANGE-JUICE",
				"name": "Orange Juice",
				"price_awg": 7.00,
				"price_usd": 4.00,
				"icon": "🧃",
				"demo_price": True,
			},
			{
				"code": "APPLE-JUICE",
				"name": "Apple Juice",
				"price_awg": 7.00,
				"price_usd": 4.00,
				"icon": "🧃",
				"demo_price": True,
			},
			{
				"code": "SOFT-DRINK-BOTTLE",
				"name": "Soft Drink — Bottle",
				"price_awg": 7.00,
				"price_usd": 4.00,
				"icon": "🥤",
				"demo_price": True,
			},
		],
	},
]


@frappe.whitelist()
def get_pos_data(flow_name: str = "Ice Cream POS"):
	"""Return the demo catalog and enabled ice-cream modifier flow."""
	flow = frappe.get_doc("Restaurant Menu Flow", flow_name)
	if not flow.enabled:
		frappe.throw(frappe._("The selected menu flow is disabled."))

	steps = []
	for step in sorted(flow.steps, key=lambda row: (row.sequence, row.idx)):
		group = frappe.get_doc("Restaurant Modifier Group", step.modifier_group)
		if not group.enabled:
			continue

		options = frappe.get_all(
			"Restaurant Modifier Option",
			filters={"modifier_group": group.name, "enabled": 1},
			fields=["name", "option_name", "description", "price_adjustment", "sequence"],
			order_by="sequence asc, option_name asc",
		)
		steps.append(
			{
				"step_name": step.step_name,
				"selection_type": group.selection_type,
				"required": bool(step.required or group.required),
				"min_selections": step.min_selections or group.min_selections or 0,
				"max_selections": step.max_selections or group.max_selections or 0,
				"dynamic_limit_from_step": step.dynamic_limit_from_step,
				"options": options,
			}
		)

	return {
		"catalog": CATALOG,
		"flow": {"flow_name": flow.flow_name, "steps": steps},
		"currencies": {"primary": "AWG", "secondary": "USD"},
	}
