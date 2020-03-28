sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Label",
	"sap/m/Input"
], function(Control, Label, Input) {
	"use strict";

	return Control.extend("skm.test.Person.control.F4Orgeh", {
		metadata: {
			properties: {
				value: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				_label: {
					type: "sap.m.Label",
					multiple: false,
					visibility: "hidden"
				},
				_input: {
					type: "sap.m.Input",
					multiple: false,
					visibility: "hidden"
				}
			}
		},
		
		init: function() {
			this.setAggregation("_label", new Label({
				text: "Label"
			}).addStyleClass("sapUiSmallMargin"));
			this.setAggregation("_input", new Input({
				showValueHelp: true,
				valueHelpRequest: this._onValueHelp				
			}).addStyleClass("sapUiTinyMarginTopBottom"));
		},

		_onValueHelp: function(oEvent) {
		// 	//用户编码输入帮助, 调用
		// 	var sInputValue = oEvent.getSource().getValue();

		// 	if (!this._valueHelpDialog) {
		// 		this._valueHelpDialog = sap.ui.xmlfragment(
		// 			"skm.test.Person.fragment.valueHelpDialogPernr",
		// 			this
		// 		);
		// 		this.getView().addDependent(this._valueHelpDialog);
		// 	}
		// 	// create a filter for the binding
		// 	this._valueHelpDialog.getBinding("items").filter([new Filter(
		// 		"Pernr",
		// 		sap.ui.model.FilterOperator.Contains, sInputValue
		// 	)]);
		// 	// open value help dialog filtered by the input value
		// 	this._valueHelpDialog.open(sInputValue);
		},

		// _handleValueHelpSearch: function(evt) {
		// 	var sValue = evt.getParameter("value");
		// 	var oFilter = new Filter(
		// 		"Pernr",
		// 		sap.ui.model.FilterOperator.Contains, sValue
		// 	);
		// 	evt.getSource().getBinding("items").filter([oFilter]);
		// },

		// _handleValueHelpClose: function(evt) {
		// 	var oSelectedItem = evt.getParameter("selectedItem");
		// 	if (oSelectedItem) {
		// 		var sTitle = oSelectedItem.getTitle();
		// 		this.getView().byId("inputPernr").setValue(sTitle);
		// 	}
		// 	evt.getSource().getBinding("items").filter([]);
		// },

		renderer: function(oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("myAppDemoWTProductRating");
			oRM.writeClasses();
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_label"));
			oRM.renderControl(oControl.getAggregation("_input"));
			oRM.write("</div>");
		}
	});
});