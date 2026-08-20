import frappe


@frappe.whitelist()
def get_pos_data(flow_name="Ice Cream POS"):
	"""Return an enabled menu flow and its available modifier options."""
	flow = frappe.get_doc("Restaurant Menu Flow", flow_name)
	if not flow.enabled:
		frappe.throw("The selected menu flow is disabled.")

	steps = []
	for step in sorted(flow.steps, key=lambda row: (row.sequence, row.idx)):
		group = frappe.get_doc("Restaurant Modifier Group", step.modifier_group)
		if not group.enabled:
			continue

		options = frappe.get_all(
			"Restaurant Modifier Option",
			filters={"modifier_group": group.name, "enabled": 1},
			fields=[
				"name",
				"option_name",
				"description",
				"price_adjustment",
				"maximum_quantity",
				"sequence",
			],
			order_by="sequence asc, option_name asc",
		)
		steps.append(
			{
				"step_name": step.step_name,
				"modifier_group": group.name,
				"selection_type": group.selection_type,
				"required": bool(step.required or group.required),
				"min_selections": step.min_selections or group.min_selections or 0,
				"max_selections": step.max_selections or group.max_selections or 0,
				"dynamic_limit_from_step": step.dynamic_limit_from_step,
				"options": options,
			}
		)

	return {
		"flow_name": flow.flow_name,
		"menu_item_code": flow.menu_item_code,
		"description": flow.description,
		"steps": steps,
	}
