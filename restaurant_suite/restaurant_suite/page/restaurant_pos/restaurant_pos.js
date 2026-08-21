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
		this.page = wrapper.page;
		this.cart = [];
		this.cashier = null;
		this.cashier_pin = "";
		this.active_category = 0;
		this.customizing = null;
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
			this.data = response.message;
			this.page.set_indicator(__("Ready"), "green");
			this.$root = $("<div class='restaurant-pos'>").appendTo(this.page.main.empty());
			this.render();
		} catch (error) {
			this.page.set_indicator(__("Error"), "red");
			frappe.msgprint(__("Restaurant POS could not load."));
		}
	}

	add_styles() {
		if (document.getElementById("restaurant-pos-styles")) return;
		$("<style id='restaurant-pos-styles'>")
			.text(
				`
			.restaurant-pos { --wine:#72002b; --cream:#fff8ef; --coral:#ee5b5b; max-width:1440px; margin:0 auto; padding:18px; }
			.pos-brand { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:16px; }
			.pos-brand h2 { color:var(--wine); font-size:28px; font-weight:800; margin:0; }
			.pos-layout { display:grid; grid-template-columns:minmax(0,2fr) minmax(330px,1fr); gap:18px; }
			.pos-shop,.pos-cart { background:var(--cream); border:1px solid #eadfd5; border-radius:18px; padding:18px; box-shadow:0 8px 24px rgba(64,25,30,.06); }
			.pos-categories { display:flex; gap:10px; overflow-x:auto; padding-bottom:8px; margin-bottom:14px; }
			.pos-category { border:1px solid #e4d6cf; background:white; color:#3d2530; border-radius:14px; padding:13px 18px; font-size:15px; font-weight:700; white-space:nowrap; }
			.pos-category.active { background:var(--wine); border-color:var(--wine); color:white; }
			.pos-products { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:14px; }
			.pos-product { border:1px solid #eadfd5; background:white; border-radius:16px; padding:0; overflow:hidden; text-align:left; min-height:205px; transition:.16s ease; }
			.pos-product:hover { transform:translateY(-2px); border-color:var(--wine); box-shadow:0 9px 22px rgba(114,0,43,.12); }
			.pos-product-art { height:112px; display:grid; place-items:center; font-size:54px; background:linear-gradient(145deg,#fff,#f8e7df); }
			.pos-product-info { padding:13px; }
			.pos-product strong { display:block; color:#2f1e27; font-size:15px; min-height:38px; }
			.pos-price { color:var(--wine); font-weight:800; margin-top:8px; }
			.pos-price small { color:#7a6870; font-weight:600; margin-left:5px; }
			.pos-demo-price { display:block; color:#a36d00; font-size:11px; margin-top:3px; }
			.pos-cart { background:white; display:flex; flex-direction:column; min-height:620px; }
			.pos-cart-title { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee5df; padding-bottom:12px; }
			.pos-cart-title h3 { margin:0; color:#2f1e27; }
			.pos-cart-items { flex:1; }
			.pos-cart-row { display:grid; grid-template-columns:1fr auto; gap:10px; padding:14px 0; border-bottom:1px solid #eee5df; }
			.pos-cart-row strong { display:block; }
			.pos-modifiers { color:#84737a; font-size:12px; margin-top:3px; }
			.pos-qty { display:flex; align-items:center; gap:8px; margin-top:7px; }
			.pos-qty button { width:28px; height:28px; border:1px solid #ddd0cb; background:#fff8f3; border-radius:8px; }
			.pos-line-price { color:var(--wine); font-weight:800; text-align:right; }
			.pos-remove { border:0; background:transparent; color:#d44; margin-top:8px; }
			.pos-empty { color:#8a777e; text-align:center; padding:80px 15px; }
			.pos-totals { border-top:2px solid #eadfd5; margin-top:12px; padding-top:12px; }
			.pos-total-line { display:flex; justify-content:space-between; padding:5px 0; }
			.pos-total-line.final { color:var(--wine); font-size:21px; font-weight:800; }
			.pos-complete { width:100%; border:0; border-radius:13px; padding:15px; margin-top:12px; background:#2faa4b; color:white; font-size:17px; font-weight:800; }
			.pos-complete:disabled { opacity:.45; }
			.pos-progress { display:flex; gap:8px; overflow-x:auto; margin-bottom:18px; }
			.pos-progress button { border:0; border-radius:999px; padding:9px 13px; white-space:nowrap; background:#eadfd5; color:#6f5a63; }
			.pos-progress button.active { background:var(--wine); color:white; }
			.pos-options { display:grid; grid-template-columns:repeat(auto-fit,minmax(145px,1fr)); gap:12px; margin:18px 0; }
			.pos-option { min-height:88px; border:2px solid #eadfd5; border-radius:13px; background:white; padding:13px; text-align:left; }
			.pos-option.selected { border-color:var(--wine); background:#fff0f4; }
			.pos-option strong,.pos-option small { display:block; }
			.pos-option small { color:#7f6d74; margin-top:6px; }
			.pos-actions { display:flex; justify-content:space-between; gap:10px; margin-top:18px; }
			.pos-login-wrap { min-height:65vh; display:grid; place-items:center; }
			.pos-login-card { width:min(420px,100%); background:white; border:1px solid #eadfd5; border-radius:20px; padding:28px; text-align:center; box-shadow:0 10px 30px rgba(64,25,30,.1); }
			.pos-login-card h2 { color:var(--wine); font-weight:800; }.pos-login-pin { width:100%; height:58px; text-align:center; font-size:30px; letter-spacing:12px; border:2px solid #dccbd3; border-radius:12px; margin:12px 0 18px; }
			.pos-login-keypad { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }.pos-login-keypad button { min-height:56px; border:1px solid #dfd0d6; border-radius:12px; background:#fff8fb; font-size:20px; font-weight:700; }.pos-login-submit { width:100%; min-height:50px; margin-top:14px; }.pos-cashier { color:#72002b; font-weight:700; }
			@media(max-width:900px){.pos-layout{grid-template-columns:1fr}.pos-cart{min-height:420px}}
			@media(max-width:560px){.restaurant-pos{padding:7px}.pos-products{grid-template-columns:repeat(2,minmax(0,1fr))}.pos-product{min-height:180px}.pos-product-art{height:90px}}
		`
			)
			.appendTo("head");
	}

	render() {
		this.$root.empty();
		if (!this.cashier) {
			this.render_cashier_login();
			return;
		}
		this.$root.append(`
			<div class="pos-brand">
				<div><h2>${__("Restaurant POS")}</h2><div class="text-muted">${__("Ice cream, pastry, drinks & coffee")}</div><div class="pos-cashier">${__("Cashier")}: ${frappe.utils.escape_html(this.cashier.employee_name)}</div></div>
				<div class="pos-brand-actions"><button class="btn btn-default pos-clock">${__("Employee Clock")}</button><button class="btn btn-default pos-lock">${__("Lock POS")}</button><button class="btn btn-default pos-clear">${__("Clear Order")}</button></div>
			</div>
		`);
		this.$root.find(".pos-clock").on("click", () => frappe.set_route("restaurant-time-clock"));
		this.$root.find(".pos-lock").on("click", () => this.lock_pos());
		this.$root.find(".pos-clear").on("click", () => this.clear_order());
		const $layout = $("<div class='pos-layout'>").appendTo(this.$root);
		const $shop = $("<section class='pos-shop'>").appendTo($layout);
		if (this.customizing) this.render_customizer($shop);
		else this.render_catalog($shop);
		this.render_cart($("<aside class='pos-cart'>").appendTo($layout));
	}

	render_cashier_login() {
		this.$root.html(`<div class="pos-login-wrap"><div class="pos-login-card"><div style="font-size:48px">🔐</div><h2>${__("Cashier Login")}</h2><p class="text-muted">${__("Enter your employee PIN")}</p><input class="pos-login-pin" type="password" readonly aria-label="${__("Employee PIN")}"><div class="pos-login-keypad"></div><button class="btn btn-primary btn-lg pos-login-submit">${__("Unlock POS")}</button></div></div>`);
		const $pad = this.$root.find(".pos-login-keypad");
		["1","2","3","4","5","6","7","8","9","Clear","0","⌫"].forEach((key) => $("<button type='button'>").text(__(key)).on("click", () => this.press_cashier_pin(key)).appendTo($pad));
		this.$root.find(".pos-login-submit").on("click", () => this.authenticate_cashier());
	}

	press_cashier_pin(key) {
		if (key === "Clear") this.cashier_pin = "";
		else if (key === "⌫") this.cashier_pin = this.cashier_pin.slice(0, -1);
		else if (this.cashier_pin.length < 8) this.cashier_pin += key;
		this.$root.find(".pos-login-pin").val(this.cashier_pin);
	}

	async authenticate_cashier() {
		if (this.cashier_pin.length < 4) return frappe.show_alert({ message: __("Enter at least 4 digits."), indicator: "orange" });
		const $button = this.$root.find(".pos-login-submit").prop("disabled", true);
		try {
			const response = await frappe.call({ method: "restaurant_suite.restaurant_suite.page.restaurant_pos.restaurant_pos.authenticate_cashier", args: { pin: this.cashier_pin } });
			this.cashier = response.message;
			this.cashier_pin = "";
			frappe.show_alert({ message: __("Welcome, {0}", [this.cashier.employee_name]), indicator: "green" });
			this.render();
		} finally { $button.prop("disabled", false); }
	}

	lock_pos() {
		const lock = () => { this.cart = []; this.cashier = null; this.cashier_pin = ""; this.customizing = null; this.render(); };
		if (this.cart.length) frappe.confirm(__("Lock the POS and clear the current order?"), lock);
		else lock();
	}

	render_catalog($container) {
		const $tabs = $("<div class='pos-categories'>").appendTo($container);
		this.data.catalog.forEach((category, index) => {
			const $button = $("<button type='button' class='pos-category'>")
				.text(`${category.icon} ${category.name}`)
				.toggleClass("active", index === this.active_category)
				.on("click", () => {
					this.active_category = index;
					this.render();
				});
			$button.appendTo($tabs);
		});

		const category = this.data.catalog[this.active_category];
		const $grid = $("<div class='pos-products'>").appendTo($container);
		category.products.forEach((product) => {
			const $card = $("<button type='button' class='pos-product'>");
			$card.append($("<div class='pos-product-art'>").text(product.icon));
			const $info = $("<div class='pos-product-info'>").appendTo($card);
			$info.append($("<strong>").text(product.name));
			$info.append(
				$("<div class='pos-price'>").html(
					`${this.money(product.price_awg, "AWG")} <small>${this.money(
						product.price_usd,
						"USD"
					)}</small>`
				)
			);
			if (product.demo_price)
				$info.append($("<span class='pos-demo-price'>").text(__("Temporary demo price")));
			$card.on("click", () => this.select_product(product)).appendTo($grid);
		});
	}

	select_product(product) {
		if (product.scoop_option) {
			this.customizing = product;
			this.selections = { Scoops: [this.find_option("Scoops", product.scoop_option).name] };
			this.current_step = 1;
			this.render();
			return;
		}
		this.add_to_cart(product, []);
	}

	render_customizer($container) {
		const flow = this.data.flow;
		const step = flow.steps[this.current_step];
		$container.append(`<h3>${frappe.utils.escape_html(this.customizing.name)}</h3>`);
		const $progress = $("<div class='pos-progress'>").appendTo($container);
		flow.steps.forEach((row, index) => {
			const $button = $("<button type='button'>").text(`${index + 1}. ${row.step_name}`);
			$button.toggleClass("active", index === this.current_step);
			if (index > 0 && index <= this.current_step)
				$button.on("click", () => {
					this.current_step = index;
					this.render();
				});
			$button.appendTo($progress);
		});

		$container.append(`<h4>${frappe.utils.escape_html(step.step_name)}</h4>`);
		const $options = $("<div class='pos-options'>").appendTo($container);
		const selected = this.selections[step.step_name] || [];
		step.options.forEach((option) => {
			const $button = $("<button type='button' class='pos-option'>");
			$button.append($("<strong>").text(option.option_name));
			$button.append($("<small>").text(__("Included")));
			$button.toggleClass("selected", selected.includes(option.name));
			$button.on("click", () => this.toggle_option(step, option.name)).appendTo($options);
		});

		const $actions = $("<div class='pos-actions'>").appendTo($container);
		$(`<button class="btn btn-default">${__("Cancel")}</button>`)
			.on("click", () => {
				this.customizing = null;
				this.render();
			})
			.appendTo($actions);
		$(
			`<button class="btn btn-primary">${
				this.current_step === flow.steps.length - 1 ? __("Add to Order") : __("Next")
			}</button>`
		)
			.on("click", () => this.next_step())
			.appendTo($actions);
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
		this.render();
	}

	get_limit(step) {
		if (!step.dynamic_limit_from_step) return cint(step.max_selections);
		const source = this.selections[step.dynamic_limit_from_step] || [];
		const source_step = this.data.flow.steps.find(
			(row) => row.step_name === step.dynamic_limit_from_step
		);
		const option = source_step.options.find((row) => row.name === source[0]);
		return cint(((option && option.option_name.match(/\d+/)) || [0])[0]);
	}

	next_step() {
		const step = this.data.flow.steps[this.current_step];
		const count = (this.selections[step.step_name] || []).length;
		const minimum = cint(step.min_selections) || (step.required ? 1 : 0);
		if (count < minimum) {
			frappe.show_alert({
				message: __("Please choose at least {0} option(s).", [minimum]),
				indicator: "red",
			});
			return;
		}
		if (this.current_step < this.data.flow.steps.length - 1) {
			this.current_step += 1;
			this.render();
			return;
		}
		const modifiers = this.data.flow.steps
			.map((row) => {
				const labels = (this.selections[row.step_name] || []).map(
					(name) =>
						row.options.find((option) => option.name === name)?.option_name || name
				);
				return labels.length ? `${row.step_name}: ${labels.join(", ")}` : null;
			})
			.filter(Boolean);
		this.add_to_cart(this.customizing, modifiers);
		this.customizing = null;
		this.selections = {};
		this.current_step = 0;
		this.render();
	}

	find_option(step_name, option_label) {
		const step = this.data.flow.steps.find((row) => row.step_name === step_name);
		return step.options.find((option) => option.option_name === option_label);
	}

	add_to_cart(product, modifiers) {
		const key = `${product.code}|${modifiers.join("|")}`;
		const existing = this.cart.find((item) => item.key === key);
		if (existing) existing.quantity += 1;
		else this.cart.push({ ...product, key, modifiers, quantity: 1 });
		frappe.show_alert({ message: __("Added {0}", [product.name]), indicator: "green" });
		this.render();
	}

	render_cart($container) {
		const $title = $("<div class='pos-cart-title'>").appendTo($container);
		$title.append(`<h3>${__("Order Summary")}</h3>`);
		$title.append($("<span class='text-muted'>").text(__("{0} item(s)", [this.item_count()])));
		const $items = $("<div class='pos-cart-items'>").appendTo($container);
		if (!this.cart.length)
			$items.append(`<div class="pos-empty">🛒<br>${__("Tap a product to begin")}</div>`);
		this.cart.forEach((item) => {
			const $row = $("<div class='pos-cart-row'>").appendTo($items);
			const $details = $("<div>").appendTo($row);
			$details.append($("<strong>").text(item.name));
			if (item.modifiers.length)
				$details.append($("<div class='pos-modifiers'>").text(item.modifiers.join(" · ")));
			const $qty = $("<div class='pos-qty'>").appendTo($details);
			$("<button type='button'>")
				.text("−")
				.on("click", () => this.change_qty(item.key, -1))
				.appendTo($qty);
			$qty.append($("<span>").text(item.quantity));
			$("<button type='button'>")
				.text("+")
				.on("click", () => this.change_qty(item.key, 1))
				.appendTo($qty);
			const $right = $("<div>").appendTo($row);
			$right.append(
				$("<div class='pos-line-price'>").text(
					this.money(item.price_awg * item.quantity, "AWG")
				)
			);
			$("<button type='button' class='pos-remove'>")
				.text(__("Remove"))
				.on("click", () => this.remove_item(item.key))
				.appendTo($right);
		});

		const totals = this.totals();
		const $totals = $("<div class='pos-totals'>").appendTo($container);
		$totals.append(
			`<div class="pos-total-line"><span>${__("Subtotal")}</span><strong>${this.money(
				totals.awg,
				"AWG"
			)}</strong></div>`
		);
		$totals.append(
			`<div class="pos-total-line final"><span>${__("Total")}</span><span>${this.money(
				totals.awg,
				"AWG"
			)}</span></div>`
		);
		$totals.append(
			`<div class="pos-total-line"><span>${__("USD reference")}</span><strong>${this.money(
				totals.usd,
				"USD"
			)}</strong></div>`
		);
		$(`<button class="pos-complete">${__("Complete Order")}</button>`)
			.prop("disabled", !this.cart.length)
			.on("click", () => this.complete_order())
			.appendTo($container);
	}

	change_qty(key, amount) {
		const item = this.cart.find((row) => row.key === key);
		item.quantity += amount;
		if (item.quantity < 1) this.remove_item(key);
		else this.render();
	}

	remove_item(key) {
		this.cart = this.cart.filter((item) => item.key !== key);
		this.render();
	}

	clear_order() {
		if (!this.cart.length) return;
		frappe.confirm(__("Clear the current order?"), () => {
			this.cart = [];
			this.render();
		});
	}

	complete_order() {
		frappe.msgprint({
			title: __("Demo Order Ready"),
			message: __("Order prepared by {0}. The next phase will create the ERPNext POS Invoice and accept payment.", [this.cashier.employee_name]),
			indicator: "green",
		});
	}

	item_count() {
		return this.cart.reduce((total, item) => total + item.quantity, 0);
	}

	totals() {
		return this.cart.reduce(
			(total, item) => ({
				awg: total.awg + flt(item.price_awg) * item.quantity,
				usd: total.usd + flt(item.price_usd) * item.quantity,
			}),
			{ awg: 0, usd: 0 }
		);
	}

	money(value, currency) {
		return `${currency} ${flt(value).toFixed(2)}`;
	}
}
