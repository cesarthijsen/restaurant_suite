frappe.pages["restaurant-time-clock"].on_page_load = function (wrapper) {
	frappe.ui.make_app_page({ parent: wrapper, title: __("Employee Time Clock"), single_column: true });
	new RestaurantTimeClock(wrapper);
};

class RestaurantTimeClock {
	constructor(wrapper) {
		this.page = wrapper.page;
		this.pin = "";
		this.render();
	}

	render() {
		this.page.main.empty().append(
			`<div class="restaurant-clock">
				<div class="clock-card">
					<div class="clock-icon">🕒</div>
					<h2>${__("Clock In / Clock Out")}</h2>
					<p>${__("Enter your employee PIN")}</p>
					<input class="clock-pin" type="password" readonly aria-label="${__("Employee PIN")}">
					<div class="clock-keypad"></div>
					<button class="clock-submit btn btn-primary btn-lg">${__("Continue")}</button>
					<div class="clock-result"></div>
					<button class="clock-open-pos btn btn-success btn-lg">${__("Open POS")}</button>
				</div>
			</div>`
		);
		this.add_styles();
		const $pad = this.page.main.find(".clock-keypad");
		["1","2","3","4","5","6","7","8","9","Clear","0","⌫"].forEach((key) =>
			$("<button type='button'>").text(__(key)).on("click", () => this.press(key)).appendTo($pad)
		);
		this.page.main.find(".clock-submit").on("click", () => this.submit());
		this.page.main.find(".clock-open-pos").on("click", () => frappe.set_route("restaurant-pos"));
	}

	add_styles() {
		if (document.getElementById("restaurant-clock-styles")) return;
		$("<style id='restaurant-clock-styles'>").text(`
			.restaurant-clock{min-height:70vh;display:grid;place-items:center;padding:24px;background:#fff8ef;border-radius:20px}
			.clock-card{width:min(430px,100%);background:#fff;padding:30px;border:1px solid #eadfd5;border-radius:22px;text-align:center;box-shadow:0 12px 35px rgba(64,25,30,.1)}
			.clock-icon{font-size:48px}.clock-card h2{color:#72002b;font-weight:800}.clock-card p{color:#7f6d74}
			.clock-pin{width:100%;height:58px;text-align:center;font-size:32px;letter-spacing:12px;border:2px solid #dccbd3;border-radius:12px;margin:12px 0 18px}
			.clock-keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.clock-keypad button{min-height:58px;border:1px solid #dfd0d6;border-radius:12px;background:#fff8fb;font-size:21px;font-weight:700;color:#3d2530}
			.clock-submit{width:100%;margin-top:16px;min-height:52px}.clock-result{margin-top:18px;font-size:18px;font-weight:700}
			.clock-open-pos{display:none;width:100%;margin-top:16px;min-height:52px;font-size:18px;font-weight:700}
		`).appendTo("head");
	}

	press(key) {
		if (key === "Clear") this.pin = "";
		else if (key === "⌫") this.pin = this.pin.slice(0, -1);
		else if (this.pin.length < 8) this.pin += key;
		this.page.main.find(".clock-pin").val(this.pin);
	}

	async submit() {
		if (this.pin.length < 4) return frappe.show_alert({ message: __("Enter at least 4 digits."), indicator: "orange" });
		const $button = this.page.main.find(".clock-submit").prop("disabled", true);
		try {
			const response = await frappe.call({
				method: "restaurant_suite.restaurant_suite.page.restaurant_time_clock.restaurant_time_clock.clock_with_pin",
				args: { pin: this.pin },
			});
			const row = response.message;
			const action = row.log_type === "IN" ? __("CLOCKED IN") : __("CLOCKED OUT");
			this.page.main.find(".clock-result").css("color", row.log_type === "IN" ? "#22863a" : "#9c6500").text(`${row.employee_name} — ${action}`);
			this.page.main.find(".clock-open-pos").show().trigger("focus");
		} finally {
			this.pin = "";
			this.page.main.find(".clock-pin").val("");
			$button.prop("disabled", false);
		}
	}
}
