sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
  ],
  function (Controller, Filter, JSONModel, DateFormat) {
    "use strict";

    return Controller.extend("soluvia.controller.View", {
      onInit: function () {
        var array = [];
        this.oModel = new sap.ui.model.odata.ODataModel(
          "/sap/opu/odata/sap/ZWLM_AV_SRV/"
        );

        this.setTags(array);

        var oJSON = new sap.ui.model.json.JSONModel({
          currentDate: new Date(), // Aktuális dátum
          currentTime: new Date(),
        });

        this.getView().setModel(oJSON, "model");
      },
      onSelectVariant: function (event) {
        var params = event.getParameters();
        switch (params.key) {
          case "1":
            this.getView().byId("IdSysidInput").setValue("HI8");
            this.getView().byId("IdBukrsInput").setValue("buk1");
            this.getView().byId("IdTcodeInput").setValue("SE11");
            this.getView().byId("IdDatumInput").setValue("");
            this.getView().byId("IdUnameInput").setValue("test-user");
            this.getView().byId("IdInfoInput").setValue("info");
            this.getView().byId("IdErrorCheckBox").setSelected(false);
            this.getView().byId("IdWarningCheckBox").setSelected(true);
            this.getView().byId("IdSuccessCheckBox").setSelected(false);
            break;
          case "2":
            this.getView().byId("IdSysidInput").setValue("HI9");
            this.getView().byId("IdBukrsInput").setValue("buk2");
            this.getView().byId("IdTcodeInput").setValue("SE38");
            this.getView().byId("IdDatumInput").setValue("");
            this.getView().byId("IdUnameInput").setValue("user-2");
            this.getView().byId("IdInfoInput").setValue("info2");
            this.getView().byId("IdErrorCheckBox").setSelected(true);
            this.getView().byId("IdWarningCheckBox").setSelected(false);
            this.getView().byId("IdSuccessCheckBox").setSelected(true);
            break;
          default:
            this.clearInputs();
            break;
        }
      },
      clearInputs: function() {
        this.getView().byId("IdSysidInput").setValue("");
        this.getView().byId("IdBukrsInput").setValue("");
        this.getView().byId("IdTcodeInput").setValue("");
        this.getView().byId("IdDatumInput").setValue("");
        this.getView().byId("IdUnameInput").setValue("");
        this.getView().byId("IdInfoInput").setValue("");
        this.getView().byId("IdErrorCheckBox").setSelected(false);
        this.getView().byId("IdWarningCheckBox").setSelected(false);
        this.getView().byId("IdSuccessCheckBox").setSelected(false);
      },
      onSearch: function () {
        var sysid = this.getView().byId("IdSysidInput").getValue();
        var bukrs = this.getView().byId("IdBukrsInput").getValue();
        var tcode = this.getView().byId("IdTcodeInput").getValue();
        var datum = this.getView().byId("IdDatumInput").getDateValue();
        var uname = this.getView().byId("IdUnameInput").getValue();
        var info = this.getView().byId("IdInfoInput").getValue();

        //Get status
        var errorStatus = this.getView().byId("IdErrorCheckBox").getSelected();
        var warningStatus = this.getView()
          .byId("IdWarningCheckBox")
          .getSelected();
        var successStatus = this.getView()
          .byId("IdSuccessCheckBox")
          .getSelected();

        var status = `${errorStatus}|${warningStatus}|${successStatus}`;

        if (datum === null) {
          datum = "1111.11.11";
        }

        var filters = new Filter({
          filters: [
            new Filter("Sysid", "EQ", sysid),
            new Filter("Bukrs", "EQ", bukrs),
            new Filter("Tcode", "EQ", tcode),
            new Filter("Datum", "EQ", datum),
            new Filter("Uname", "EQ", uname),
            new Filter("Info", "EQ", info),
            new Filter("Status", "EQ", status),
          ],
          and: true,
        });

        this.oModel.read("/MonitoringSet", {
          filters: [filters],
          success: function (oData) {
            // success branch
            var resultModel = new sap.ui.model.json.JSONModel(oData.results);
            this.getView().setModel(resultModel, "resultModel");
            this.setTags(oData.results);
          }.bind(this),
          error: function (oError) {
            //Error branch
          },
        });
      },
      formatDate: function (oDate) {
        if (!oDate) {
          return "";
        }

        if (!(oDate instanceof Date)) {
          oDate = new Date(oDate);
        }

        var oDateFormat = DateFormat.getDateInstance({ style: "medium" });
        return oDateFormat.format(oDate);
      },
      setTags: function (result) {
        var numOfLines = 0;
        var numOfWarning = 0;
        var numOfSuccess = 0;
        var numOfError = 0;

        numOfLines = result.length;

        for (var i = 0; i < result.length; i++) {
          switch (result[i].Status) {
            case "SUCCESS":
              numOfSuccess++;
              break;
            case "WARNING":
              numOfWarning++;
              break;
            case "ERROR":
              numOfError++;
              break;
            default:
              break;
          }
        }

        var statusModel = new JSONModel({
          numberOfLines: numOfLines,
          numberOfSuccess: numOfSuccess,
          numberOfWarning: numOfWarning,
          numberOfError: numOfError,
        });

        this.getView().setModel(statusModel, "statusModel");
      },
    });
  }
);
