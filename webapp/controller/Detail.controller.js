sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/SimpleType",
	"sap/ui/model/ValidateException"
], function(Controller, UIComponent, History, Filter, SimpleType, ValidateException) {
	"use strict";
	var oModel;
	var sCurrentPath;
	var sCurrentPernr;
	var aFilters;

	return Controller.extend("skm.test.Person.controller.Detail", {

		onInit: function() {
			oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(false);
			this.getView().setModel(oModel);

			// attach handlers for validation errors
			sap.ui.getCore().getMessageManager().registerObject(this.oView.byId("inputUsrid4"), true);
			sap.ui.getCore().getMessageManager().registerObject(this.oView.byId("inputUsrid8"), true);

			sCurrentPath = "";
			sCurrentPernr = "";
			// this.funQueryPa0022(sCurrentPernr);

			this.router = UIComponent.getRouterFor(this);
			this.router.getRoute("rou_Detail").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			sCurrentPath = "";
			sCurrentPernr = "";

			sCurrentPath = decodeURIComponent(oEvent.getParameter("arguments").para);
			if (sCurrentPath) {
				this.getView().bindElement(sCurrentPath);
				var oContext = this.getView().getBindingContext();
				if (oContext) {
					sCurrentPernr = oContext.getProperty("Pernr");
				}
			}
			this.funQueryPa0022(sCurrentPernr);
		},

		funQueryPa0022: function(sPernr) {
			aFilters = [];
			if (sPernr) {
				aFilters = [new Filter("Pernr", sap.ui.model.FilterOperator.EQ, sPernr)];
			} else {
				aFilters = [new Filter("Pernr", sap.ui.model.FilterOperator.EQ, "99999999")];
			}
			oModel.read("/Pa0022Set", {
				filters: aFilters,
				success: function(oData, oResponse) {
					// window.console.log(oData);
				}
			});
			this.byId("tablePa0022").getBinding("items").filter(aFilters);
		},

		onNavButtonPress: function(oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Tar_View1", {}, true);
			}
		},

		onButtonSave: function(oEvent) {
			this.funSaveByCreate();
			// this.funSaveByUpdate();
			// this.funSaveByRead();
		},

		funSaveByCreate: function() {
			var oChanges = {
				"Pernr": "",
				"Usrid4": "",
				"Usrid8": ""
			};
			oChanges.Pernr = this.getView().byId("inputPernr").getValue();
			oChanges.Usrid4 = this.getView().byId("inputUsrid4").getValue();
			oChanges.Usrid8 = this.getView().byId("inputUsrid8").getValue();

			oModel.create("/Pa0105Set", oChanges, {
				success: function(oData, oResponse) {
					window.console.log("oData", oData);
					window.console.log("oResponse", oResponse);
					sap.m.MessageToast.show("Changes were saved successfully.");
					// if (oData.Pernr) {
					// 	//返回的人员编号为空, 表示保存失败
					// 	// this.getView().byId("inputUsrid4").setValue(oData.Usrid4);
					// 	// this.getView().byId("inputUsrid8").setValue(oData.Usrid8);						
					// 	sap.m.MessageToast.show("保存失败.");
					// } else {
					// sap.m.MessageToast.show("Changes were saved successfully.");
					// }
				},
				error: function(oError) {
					window.console.log("Error", oError);
					sap.m.MessageToast.show("保存失败.");
				}
			});
		},


		funSaveByUpdate: function() {
			var oChanges = {
				"Pernr": "",
				"Usrid4": "",
				"Usrid8": ""
			};
			oChanges.Pernr = this.getView().byId("inputPernr").getValue();
			oChanges.Usrid4 = this.getView().byId("inputUsrid4").getValue();
			oChanges.Usrid8 = this.getView().byId("inputUsrid8").getValue();

			oModel.update("/Pa0105Set('20000144')", oChanges, {
				success: function(oData, oResponse) {
					window.console.log("oData", oData);
					window.console.log("oResponse", oResponse);
					sap.m.MessageToast.show("Changes were saved successfully.");
				},
				error: function(oError) {
					window.console.log("Error", oError);
					sap.m.MessageToast.show("保存失败.");
				}
			});
		},

		funSaveByRead: function() {
			//保存数据, Odata的Update无法触发, 调整在read中更新数据
			var oChanges = {
				"Pernr": "",
				"Usrid4": "",
				"Usrid8": ""
			};
			oChanges.Pernr = this.getView().byId("inputPernr").getValue();
			oChanges.Usrid4 = this.getView().byId("inputUsrid4").getValue();
			oChanges.Usrid8 = this.getView().byId("inputUsrid8").getValue();

			aFilters = [];
			var filterPernr = new Filter("Pernr", sap.ui.model.FilterOperator.EQ, oChanges.Pernr);
			aFilters.push(filterPernr);
			var filterUsrid4 = new Filter("Usrid4", sap.ui.model.FilterOperator.EQ, oChanges.Usrid4);
			aFilters.push(filterUsrid4);
			var filterUsrid8 = new Filter("Usrid8", sap.ui.model.FilterOperator.EQ, oChanges.Usrid8);
			aFilters.push(filterUsrid8);

			oModel.read("/Pa0105Set", {
				filters: aFilters,
				success: function(oData, oResponse) {
					window.console.log(oData);
					sap.m.MessageToast.show("Changes were saved successfully.");
				},
				error: function(oError) {
					window.console.log("Error", oError);
				}
			});
		},

		customEMailType: SimpleType.extend("email", {
			formatValue: function(oValue) {
				return oValue;
			},
			parseValue: function(oValue) {
				//parsing step takes place before validating step, value could be altered here
				return oValue;
			},
			validateValue: function(oValue) {
				// The following Regex is NOT a completely correct one and only used for demonstration purposes.
				// RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
				var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
				if (!oValue.match(rexMail)) {
					throw new ValidateException("'" + oValue + "' is not a valid email address");
				}
			}
		}),
		
		customTelType: SimpleType.extend("tel", {
			formatValue: function(oValue) {
				return oValue;
			},
			parseValue: function(oValue) {
				return oValue;
			},
			validateValue: function(oValue) {
				var rexMail = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!oValue.match(rexMail)) {
					throw new ValidateException("'" + oValue + "' is not a valid Tel Number");
				}
			}
		})	
		
		

	});

});