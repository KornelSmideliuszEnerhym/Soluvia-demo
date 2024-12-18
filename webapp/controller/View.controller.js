sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, Filter, JSONModel) {
    "use strict";

    return Controller.extend("soluvia.controller.View", {
      onInit: function () {
        this.oModel = new sap.ui.model.odata.ODataModel(
          "/sap/opu/odata/sap/ZWLM_AV_SRV/"
        );
        var array = [];
        this.setNOL(array);
      },

      getDbRecors: function () {
        // var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY/MM/DD" });

        var sysid = this.getView().byId("IdSysidInput").getValue();
        var bukrs = this.getView().byId("IdBukrsInput").getValue();
        var tcode = this.getView().byId("IdTcodeInput").getValue();
        var datum = this.getView().byId("IdDatumInput").getValue();
        var uname = this.getView().byId("IdUnameInput").getValue();
        var status = this.getView().byId("IdStatusInput").getValue();
        var info = this.getView().byId("IdInfoInput").getValue();

        if (datum === "") {
          datum = "1111.11.11";
        }

        var filters = new Filter({
          filters: [
            new Filter("Sysid", "EQ", sysid),
            new Filter("Bukrs", "EQ", bukrs),
            new Filter("Tcode", "EQ", tcode),
            new Filter("Datum", "EQ", datum),
            new Filter("Uname", "EQ", uname),
            new Filter("Status", "EQ", status),
            new Filter("Info", "EQ", info),
          ],
          and: true,
        });

        debugger;

        this.oModel.read("/MonitoringSet", {
          filters: [filters],
          success: function (oData) {
            // success branch
            var resultModel = new sap.ui.model.json.JSONModel(oData.results);
            this.getView().setModel(resultModel, "resultModel");
            this.setNOL(oData.results);
          }.bind(this),
          error: function (oError) {
            //Error branch
          },
        });
      },
      onSearch: function () {
        this.getDbRecors();
      },
      setNOL: function (result) {
        var numOfLines = 0;
        var numOfWarning = 0;
        var numOfSuccess = 0;

        numOfLines = result.length;

        debugger;
        for (var i = 0; i < result.length; i++) {
          switch (result[i].Status) {
            case "SUCCESS":
              numOfSuccess++;
              break;
            default:
              numOfWarning++;
              break;
          }
        }

        var statusModel = new JSONModel({
          numberOfLines: numOfLines,
          numberOfSuccess: numOfSuccess,
          numberOfWarning: numOfWarning,
        });
        
        this.getView().setModel(statusModel, "statusModel");
      },
    });
  }
);
