using System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Entities.Projects;
using Projects.Web.Models;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class FieldworkPriceEntityExtensions
    {


        public static void addFieldWorkForm(this tbl_fieldwork_price Fieldwork, FieldworkViewModel FieldworkVM)

        {
            Fieldwork.tenant_id = FieldworkVM.tenant_id;
            Fieldwork.project_id = FieldworkVM.project_id;
            Fieldwork.fieldwork_name = FieldworkVM.fieldwork_name;
            Fieldwork.fieldwork_description = FieldworkVM.fieldwork_description;
            Fieldwork.fieldwork_price = FieldworkVM.fieldwork_price;
            Fieldwork.unit_of_measurement = FieldworkVM.unit_of_measurement;

        }

    }
}