sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Input",
	"sap/m/MessageToast",
	"sap/ui/model/Filter"
], function(Control, Input, MessageToast, Filter) {
	"use strict";

	return Input.extend("DemoF4Matnr.controls.F4Matnr", {
		//元数据, 控件属性
		metadata: {
			properties: {
				value: {
					type: "string",
					defaultValue: ""
				},
				showValueHelp: {
					type: "boolean",
					defaultValue: true
				},
				placeholder: {
					type: "string",
					defaultValue: "物料编码"
				},
				Description: {
					type: "string",
					defaultValue: "物料描述"
				},
				fieldWidth: {
					type: "string",
					defaultValue: "50%"
				}
			},
			//聚合: 控件下能包含那些子控件
			aggregations: {
			},
			//事件
			events: {
				"onSelect": {
					allowPreventDefault: true,
					parameters: {
						"material": {
							type: "object"
						},
						"materialDescription": {
							type: "string"
						}
					}
				}
			},
			renderer: null
		},

		init: function() {

			Input.prototype.init.call(this);

			this.attachChange(this.onChange);

			this.attachValueHelpRequest(this.onValueHelpRequest);

			this.attachOnSelect(this.onSelect);
		},

		renderer: function(oRm, oInput) {	    
			sap.m.InputRenderer.render(oRm, oInput);
// 			oRm.write("<Label>");
// 			oRm.write(oInput.getText());
// 			oRm.write("</Label>");
		},

		onValueHelpRequest: function(oEvent) {
			// function name speaks for itself
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("service/data.json");

			oModel.attachRequestCompleted(function() {
				that.setModel(oModel, "materials");

				var oTemplate = new sap.m.StandardListItem("DialogMatnrItems", {
					title: "{Material}",
					description: "{MaterialDescription}"
				});

				var oDialog = new sap.m.SelectDialog("dialogParentTableMatnr", {
					title: "Select Material",
					confirm: function(oConfirmEvent) {
						that.closeDialogMatnrItems(oConfirmEvent);
					},
					cancel: function(oCancelEvent) {
						that.closeDialogMatnrItems(oCancelEvent);
					},
					search: function(oEvt) {
						var sValue = oEvt.getParameter("value");
						if (!sValue || sValue === "") {
							oEvent.getSource().getBinding("items").filter([]);
						} else {
							var filter = new Filter("MaterialDescription", sap.ui.model.FilterOperator.Contains, sValue);
							var oBinding = oEvent.getSource().getBinding("items");
							oBinding.filter([filter]);
						}
					}
				});
				oDialog.setModel(that.getModel("materials"));
				oDialog.bindAggregation("items", "/results", oTemplate);
				oDialog.open();
			});
		},

		closeDialogMatnrItems: function(oEvent) {
			var oDialog = oEvent.getSource();
			
			oDialog.destroyItems();
			oDialog.destroy();
			if (oEvent.getParameter("selectedItem") && oEvent.getParameter("selectedItem").getBindingContext()) {
				var obj = oEvent.getParameter("selectedItem").getBindingContext().getObject();

				this.setValue(obj.Material);
				this.setDescription(obj.MaterialDescription);
				
				// fire event to notify view of selection
				this.fireOnSelect({
					"material": obj.Material,
					"materialDescription": obj.MaterialDescription
				});
			}
		},

		onChange: function(oEvent) {
			// fires on focus leave or when user presses Enter
			if (oEvent.type === "sapfocusleave") {
				return false;
			}
			if (!oEvent.target.value) {
				return false;
			}

			// get control value and try to get its description from model
			var material = oEvent.target.value;
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("service/data.json");

			oModel.attachRequestCompleted(function() {

				that.setModel(oModel, "materials");
				var oData = oModel.getData();

				for (var i = 0; i < oData.results.length; i++) {
					if (oData.results[i].Material === material) {
						that.setValue(material);
						that.setDescription(oData.results[i].MaterialDescription);
						that.fireOnSelect({
							"material": material,
							"materialDescription": oData.results[i].MaterialDescription
						});
						return;
					}
				}

				MessageToast.show("Material Number " + material + " Does not Exist.");
			});

		},

		onSelect: function(oEvent) {

		}

	});
});