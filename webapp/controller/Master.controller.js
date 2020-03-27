sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"
], function(Controller, Filter, JSONModel) {
	"use strict";
	var oModel;
	var oRouter;
	var aFilters = [];

	return Controller.extend("skm.test.Person.controller.Master", {

		onInit: function() {
			oModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oModel);

			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			this.byId("inputPernr").setFilterFunction(this.onSuggestion);
			// this.byId("inputOrgeh").setFilterFunction(this.onSuggestion);

			//查询数据: init是不让显示数据, 查询条件设置为一个不存在的员工和部门
			this.funQuery("99999999", "99999999");
		},
		
		onSuggestion: function(sTerm, oItem){
			return oItem.getText().match(new RegExp(sTerm, "i"));
		},

		onPressQuery: function(oEvent) {
			var sInputPernr = this.getView().byId("inputPernr").getValue();
			var sInputOrgeh = this.getView().byId("inputOrgeh").getValue();

			//根据员工, 部门查询符合条件的数据(只能精确查找, 如果想实现模糊查询, 则需要调整ODATA接口)
			this.funQuery(sInputPernr, sInputOrgeh);
		},

		funQuery: function(sPernr, sOrgeh) {
			//查询人员信息
			aFilters = [];
			if (sPernr && sPernr.length > 0) {
				var filterPernr = new Filter("Pernr", sap.ui.model.FilterOperator.EQ, sPernr);
				aFilters.push(filterPernr);
			}
			if (sOrgeh && sOrgeh.length > 0) {
				var filterOrgeh = new Filter("Orgeh", sap.ui.model.FilterOperator.EQ, sOrgeh);
				aFilters.push(filterOrgeh);
			}
			oModel.read("/PersonSet", {
				filters: aFilters,
				success: function(oData, oResponse) {
					window.console.log(oData);
					// sap.m.MessageToast.show("数据查询成功.");
				},
				error: function(oError) {
					window.console.log("Error", oError);
					sap.m.MessageToast.show("数据查询失败, 请检查网络连接.");
				}
			});
			this.byId("listPerson").getBinding("items").filter(aFilters);

			oRouter.navTo("rou_Detail", {
				para: encodeURIComponent("/PersonSet('99999999')")
			}, false);
		},

		onItemPress: function(oEvent) {
			//选择行, 获取点击行的路径,触发路由跳转到Detail界面,并将路径传递到新页面
			var oContext = oEvent.getSource().getBindingContext();
			var sCurrentPath = oContext.getPath();
			oRouter.navTo("rou_Detail", {
				para: encodeURIComponent(sCurrentPath)
			}, false);
		},

		onValueHelpPernr: function(oEvent) {
			//用户编码输入帮助, 调用
			var sInputValue = oEvent.getSource().getValue();

			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"skm.test.Person.fragment.valueHelpDialogPernr",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"Pernr",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Pernr",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var sTitle = oSelectedItem.getTitle();
				this.getView().byId("inputPernr").setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		},

		//Input Orgeh value help
		onValueHelpOrgeh: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			aFilters = [];
			if (sInputValue && sInputValue.Length > 0) {
				aFilters = [new Filter("Orgeh", sap.ui.model.FilterOperator.EQ, sInputValue)];
			}
			// oModel.read("/F4OrgehSet", {
			// 	filters: aFilters,
			// 	success: function(oData, oResponse) {
			// 		window.console.log(oData);
			// 		window.console.log(oResponse);
			// 	},
			// 	error: function(oError) {
			// 		window.console.log("Error", oError);
			// 	}
			// });

			if (!this._valueHelpDialogOrgeh) {
				this._valueHelpDialogOrgeh = sap.ui.xmlfragment(
					"skm.test.Person.fragment.valueHelpDialogOrgeh",
					this
				);
				this.getView().addDependent(this._valueHelpDialogOrgeh);
			}
			this._valueHelpDialogOrgeh.getBinding("items").filter(aFilters);
			this._valueHelpDialogOrgeh.open(sInputValue);
		},

		_handleValueHelpSearchOrgeh: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Orgeh",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseOrgeh: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var sTitle = oSelectedItem.getTitle();
				this.getView().byId("inputOrgeh").setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		}

	});

});