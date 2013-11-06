/*global jQuery, Handlebars */
(function (window, docment, $) {
  'use strict';
  $(function () {

    $.when(Handlebars.getTemplate('user'), $.getJSON('/user/details')).done(function (userTemplate, userResp) {
      var userDetails = userResp[0];
      $("#user").html(userTemplate(userDetails));

      //fetch company info
      var dfds = [];
      $.each(userDetails.positions.values, function (idx, position) {
        if (position.company.id !== undefined) {
          //go fetch its details
          var companyId = position.company.id;
          dfds.push($.getJSON('/company/' + companyId));
        }
      });

      $.when.apply(this, dfds).done(function () {
        console.log(arguments);
      });

    });

  });

}(this, document, jQuery));