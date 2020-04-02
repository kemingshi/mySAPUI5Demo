sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"

], function(Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("DemoF4Matnr.controller.App", {
		onInit: function() {
			var viewModel = new JSONModel({
				Matnr: "",
				Maktx: ""
			});
			this.getView().setModel(viewModel, "material");
		},

		onMatnrSelect: function(oEvent) {
			// Called  whenever Matnr has been changed (either by pressing Enter, lost Focus,  or Value Help Selection )
			var matnr = oEvent.getParameter("material");
			var matnrDescription = oEvent.getParameter("materialDescription");
		},

		onLiveChange: function(oEvent) {
			var matnr = oEvent.getParameter("material");
			if (!matnr) {
				this.getView().getModel("material").setProperty("Maktx", "");
			}
		}
	});
});