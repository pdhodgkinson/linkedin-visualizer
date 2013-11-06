/**
 * Created by peter on 17/09/13.
 */
/*global jQuery, Handlebars */
(function (window, $) {
  "use strict";

  //Peter move this to index js file
  $(function () {
    $('[data-api]').on('click', 'button', function (e) {
      var apiEl = $(e.delegateTarget),
        api = apiEl.data('api'),
        values;

      if (api === 'people') {
        values = apiEl.find('.checkbox-group :checked').map(function () {
          return $(this).val();
        }).get().join();
        $.getJSON(
          '/api/' + api,
          {
            query: values
          },
          function (data) {
            console.log(data);
          }
        );
      }
    });

    $('[data-checkbox-group-id]').on('click', function (e) {
      var checked = $(this).prop('checked'),
        groupId = $(this).data('checkboxGroupId'),
        checkboxes = $('#' + groupId).find(':checkbox');
      checkboxes.prop('checked', checked);
    });

    $('.checkbox-group').on('click', ':checkbox', function (e) {
      var dt = $(e.delegateTarget),
        allBoxes = dt.find(':checkbox'),
        checked = allBoxes.filter(':checked'),
        targetBox = $('[data-checkbox-group-id="' + dt.attr('id') + '"]');

      if (checked.length === 0) {
        targetBox.prop('checked', false);
        targetBox.prop('indeterminate', false);
      } else if (checked.length === allBoxes.length) {
        targetBox.prop('checked', true);
        targetBox.prop('indeterminate', false);
      } else {
        targetBox.prop('indeterminate', true);
      }

    });
  });

  Handlebars.getTemplate = function (name) {
    var dfd = $.Deferred();

    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
      $.ajax({
        url : 'javascripts/templates/' + name + '.handlebars',
        datatype: 'text/javascript'
      }).then(function (response, status, jqXHR) {
        if (Handlebars.templates === undefined) {
          Handlebars.templates = {};
        }
        //Handlebars.templates[name] = Handlebars.compile(jqXHR.responseText);
        Handlebars.templates[name] = Handlebars.compile(response);
        dfd.resolve(Handlebars.templates[name]);
      }, function (response, status, jqXHR) {
        dfd.reject(response, status, jqXHR);
      });
    } else {
      dfd.resolve(Handlebars.templates[name]);
    }

    return dfd.promise();
  };

}(this, jQuery));
