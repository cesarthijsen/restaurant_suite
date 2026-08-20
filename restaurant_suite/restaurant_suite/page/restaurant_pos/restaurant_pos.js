frappe.pages["restaurant-pos"].on_page_load = function (wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: __("Restaurant POS"),
		single_column: true,
	});

	new RestaurantPOS(wrapper);
};

class RestaurantPOS {
	constructor(wrapper) {
		this.wrapper = wrapper;
		this.page = wrapper.page;
		this.selections = {};
		this.current_step = 0;
		this.add_styles();
		this.load();
	}

	async load() {
		this.page.set_indicator(__("Loading"), "orange");
		try {
			const response = await frappe.call({
				method: "restaurant_suite.restaurant_suite.page.restaurant_pos.restaurant_pos.get_pos_data",
			});
			this.flow = response.message;
			this.page.set_indicator(__("Ready"), "green");
			this.render();
		} catch (error) {
			this.page.set_indicator(__("Error"), "red");
			frappe.msgprint(
				__("Restaurant POS could not load. Check that Ice Cream POS is enabled.")
			);
		}
	}

	add_styles() {
		if (document.getElementById("restaurant-pos-styles")) return;
		$("<style id='restaurant-pos-styles'>")
			.text(
				`
			.restaurant-pos { max-width: 1180px; margin: 0 auto; padding: 18px; }
			.pos-header { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:18px; }
			.pos-header h2 { margin:0; font-weight:700; }
			.pos-layout { display:grid; grid-template-columns:minmax(0, 2fr) minmax(280px, 1fr); gap:18px; }
			.pos-panel { background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:20px; }
			.pos-progress { display:flex; gap:8px; margin-bottom:22px; overflow-x:auto; }
			.pos-progress button { border:0; border-radius:999px; padding:8px 14px; white-space:nowrap; background:var(--control-bg); color:var(--text-muted); }
			.pos-progress button.active { background:var(--primary); color:white; }
			.pos-options { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin:18px 0; }
			.pos-option { min-height:92px; border:2px solid var(--border-color); border-radius:12px; background:var(--card-bg); padding:14px; text-align:left; transition:.15s ease; }
			.pos-option:hover { border-color:var(--primary); transform:translateY(-1px); }
			.pos-option.selected { border-color:var(--primary); background:var(--blue-50); }
			.pos-option strong { display:block; font-size:16px; }
			.pos-option small { color:var(--text-muted); }
			.pos-actions { display:flex; justify-content:space-between; gap:12px; margin-top:18px; }
			.pos-summary h4 { margin-top:0; }
			.pos-summary-row { padding:11px 0; border-bottom:1px solid var(--border-color); }
			.pos-summary-row strong { display:block; }
			.pos-empty { color:var(--text-muted); }
			.pos-complete { text-align:center; padding:34px 10px; }
			.pos-complete .octicon { font-size:46px; color:var(--green-500); }
			@media (max-width: 760px) { .pos-layout { grid-template-columns:1fr; } .restaurant-pos { padding:8px; } }
		`
			)
			.appendTo("head");
	}

	render() {
		this.$root = $("<div class='restaurant-pos'>").appendTo(this.page.main.empty());
		this.render_step();
	}

	render_step() {
		const step = this.flow.steps[this.current_step];
		const completed = this.current_step >= this.flow.steps.length;
		this.$root.empty();
		this.$root.append(`
			<div class="pos-header">
				<div><h2>${frappe.utils.escape_html(
					this.flow.flow_name
				)}</h2><div class="text-muted">${frappe.utils.escape_html(
			this.flow.description || ""
		)}</div></div>
				<button class="btn btn-default pos-reset">${__("Start Over")}</button>
			</div>
		`);
		this.$root.find(".pos-reset").on("click", () => this.reset());

		const $layout = $("<div class='pos-layout'>").appendTo(this.$root);
		const $main = $("<div class='pos-panel'>").appendTo($layout);
		this.render_progress($main);
		if (completed) this.render_complete($main);
		else this.render_options($main, step);
		this.render_summary($("<aside class='pos-panel pos-summary'>").appendTo($layout));
	}

	render_progress($container) {
		const $progress = $("<div class='pos-progress'>").appendTo($container);
		this.flow.steps.forEach((step, index) => {
			const $button = $("<button type='button'>").text(`${index + 1}. ${step.step_name}`);
			if (index === this.current_step) $button.addClass("active");
			if (index <= this.current_step)
				$button.on("click", () => {
					this.current_step = index;
					this.render_step();
				});
			$button.appendTo($progress);
		});
	}

	render_options($container, step) {
		const limit = this.get_limit(step);
		const instruction = step.required
			? __("Required — choose {0}", [
					limit === 1 ? __("one") : __("up to {0}", [limit || __("any number")]),
			  ])
			: __("Optional");
		$container.append(
			`<h3>${frappe.utils.escape_html(
				step.step_name
			)}</h3><div class="text-muted">${instruction}</div>`
		);
		const $options = $("<div class='pos-options'>").appendTo($container);
		const selected = this.selections[step.step_name] || [];
		step.options.forEach((option) => {
			const price = flt(option.price_adjustment);
			const $button = $("<button type='button' class='pos-option'>");
			$button.append($("<strong>").text(option.option_name));
			$button.append($("<small>").text(price ? format_currency(price) : __("Included")));
			$button.toggleClass("selected", selected.includes(option.name));
			$button.on("click", () => this.toggle_option(step, option.name));
			$button.appendTo($options);
		});

		const $actions = $("<div class='pos-actions'>").appendTo($container);
		const $back = $(`<button class="btn btn-default">${__("Back")}</button>`).appendTo(
			$actions
		);
		$back.prop("disabled", this.current_step === 0).on("click", () => {
			this.current_step -= 1;
			this.render_step();
		});
		$(
			`<button class="btn btn-primary">${
				this.current_step === this.flow.steps.length - 1 ? __("Review Order") : __("Next")
			}</button>`
		)
			.appendTo($actions)
			.on("click", () => this.next());
	}

	toggle_option(step, option_name) {
		let selected = this.selections[step.step_name] || [];
		if (selected.includes(option_name))
			selected = selected.filter((name) => name !== option_name);
		else if (step.selection_type === "Single") selected = [option_name];
		else {
			const limit = this.get_limit(step);
			if (limit && selected.length >= limit) {
				frappe.show_alert({
					message: __("You can choose up to {0}.", [limit]),
					indicator: "orange",
				});
				return;
			}
			selected = [...selected, option_name];
		}
		this.selections[step.step_name] = selected;
		this.render_step();
	}

	get_limit(step) {
		if (!step.dynamic_limit_from_step) return cint(step.max_selections);
		const source = this.selections[step.dynamic_limit_from_step] || [];
		if (!source.length) return 0;
		const source_step = this.flow.steps.find(
			(row) => row.step_name === step.dynamic_limit_from_step
		);
		const option = source_step.options.find((row) => row.name === source[0]);
		return cint(((option && option.option_name.match(/\d+/)) || [0])[0]);
	}

	next() {
		const step = this.flow.steps[this.current_step];
		const count = (this.selections[step.step_name] || []).length;
		const minimum = cint(step.min_selections) || (step.required ? 1 : 0);
		if (count < minimum) {
			frappe.show_alert({
				message: __("Please choose at least {0} option(s).", [minimum]),
				indicator: "red",
			});
			return;
		}
		this.current_step += 1;
		this.render_step();
	}

	render_summary($container) {
		$container.append(
			`<h4>${__("Order Summary")}</h4><div class="text-muted">${frappe.utils.escape_html(
				this.flow.menu_item_code
			)}</div>`
		);
		let has_selection = false;
		this.flow.steps.forEach((step) => {
			const names = this.selections[step.step_name] || [];
			if (!names.length) return;
			has_selection = true;
			const labels = names.map(
				(name) => step.options.find((option) => option.name === name)?.option_name || name
			);
			const $row = $("<div class='pos-summary-row'>").appendTo($container);
			$row.append($("<strong>").text(step.step_name));
			$row.append($("<span>").text(labels.join(", ")));
		});
		if (!has_selection)
			$container.append(
				`<p class="pos-empty">${__("Your selections will appear here.")}</p>`
			);
	}

	render_complete($container) {
		$container.append(`
			<div class="pos-complete">
				<span class="octicon octicon-check-circle"></span>
				<h3>${__("Order Ready")}</h3>
				<p class="text-muted">${__("The ice-cream configuration is complete.")}</p>
				<button class="btn btn-primary pos-new-order">${__("New Order")}</button>
			</div>
		`);
		$container.find(".pos-new-order").on("click", () => this.reset());
	}

	reset() {
		this.selections = {};
		this.current_step = 0;
		this.render_step();
	}
}
