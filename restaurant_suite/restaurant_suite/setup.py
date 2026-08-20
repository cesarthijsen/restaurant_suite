import frappe


STARTER_GROUPS = {
	"Scoop Count": {
		"selection_type": "Single",
		"required": 1,
		"min_selections": 1,
		"max_selections": 1,
		"sequence": 10,
		"options": ["1 Scoop", "2 Scoops", "3 Scoops"],
	},
	"Serving Type": {
		"selection_type": "Single",
		"required": 1,
		"min_selections": 1,
		"max_selections": 1,
		"sequence": 20,
		"options": ["Cup", "Cone", "Waffle Cone", "Sundae", "Other"],
	},
	"Flavor": {
		"selection_type": "Dynamic",
		"required": 1,
		"min_selections": 1,
		"max_selections": 0,
		"sequence": 30,
		"options": ["Vanilla", "Chocolate", "Strawberry"],
	},
	"Toppings": {
		"selection_type": "Multiple",
		"required": 0,
		"min_selections": 0,
		"max_selections": 0,
		"sequence": 40,
		"options": ["Whipped Cream", "Chocolate Sauce", "Sprinkles"],
	},
}


@frappe.whitelist()
def create_ice_cream_starter():
	"""Create or refresh the reusable ice-cream modifier flow."""
	for group_name, values in STARTER_GROUPS.items():
		group = _upsert_group(group_name, values)
		_upsert_options(group.name, values["options"])

	flow = _upsert_flow()
	return {
		"modifier_groups": list(STARTER_GROUPS),
		"menu_flow": flow.name,
	}


def _upsert_group(group_name, values):
	if frappe.db.exists("Restaurant Modifier Group", group_name):
		group = frappe.get_doc("Restaurant Modifier Group", group_name)
	else:
		group = frappe.new_doc("Restaurant Modifier Group")
		group.group_name = group_name

	for fieldname in (
		"selection_type",
		"required",
		"min_selections",
		"max_selections",
		"sequence",
	):
		setattr(group, fieldname, values[fieldname])

	group.enabled = 1
	group.save(ignore_permissions=True)
	return group


def _upsert_options(group_name, option_names):
	for sequence, option_name in enumerate(option_names, start=10):
		name = f"{group_name}-{option_name}"
		if frappe.db.exists("Restaurant Modifier Option", name):
			option = frappe.get_doc("Restaurant Modifier Option", name)
		else:
			option = frappe.new_doc("Restaurant Modifier Option")
			option.modifier_group = group_name
			option.option_name = option_name

		option.enabled = 1
		option.sequence = sequence
		option.save(ignore_permissions=True)


def _upsert_flow():
	flow_name = "Ice Cream POS"
	if frappe.db.exists("Restaurant Menu Flow", flow_name):
		flow = frappe.get_doc("Restaurant Menu Flow", flow_name)
	else:
		flow = frappe.new_doc("Restaurant Menu Flow")
		flow.flow_name = flow_name

	flow.menu_item_code = "ICE-CREAM"
	flow.description = "Scoops → Serving Type → Flavors → Toppings"
	flow.enabled = 1
	flow.set("steps", [])

	for sequence, (step_name, group_name) in enumerate(
		(
			("Scoops", "Scoop Count"),
			("Serving Type", "Serving Type"),
			("Flavors", "Flavor"),
			("Toppings", "Toppings"),
		),
		start=10,
	):
		group = STARTER_GROUPS[group_name]
		flow.append(
			"steps",
			{
				"step_name": step_name,
				"modifier_group": group_name,
				"required": group["required"],
				"min_selections": group["min_selections"],
				"max_selections": group["max_selections"],
				"dynamic_limit_from_step": "Scoops" if group_name == "Flavor" else None,
				"sequence": sequence,
			},
		)

	flow.save(ignore_permissions=True)
	return flow
