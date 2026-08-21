frappe.ui.form.on("Restaurant Employee PIN", {
	refresh(frm) {
		if (frm.is_new()) return;
		frm.add_custom_button(__("Set / Change PIN"), () => {
			const dialog = new frappe.ui.Dialog({
				title: __("Set Employee PIN"),
				fields: [{ fieldname: "pin", fieldtype: "Password", label: __("New PIN"), reqd: 1 }],
				primary_action_label: __("Save PIN"),
				primary_action(values) {
					frappe.call({
						method: "restaurant_suite.restaurant_suite.doctype.restaurant_employee_pin.restaurant_employee_pin.set_pin",
						args: { name: frm.doc.name, pin: values.pin },
						callback() {
							dialog.hide();
							frappe.show_alert({ message: __("PIN updated"), indicator: "green" });
						},
					});
				},
			});
			dialog.show();
		});
	},
});
