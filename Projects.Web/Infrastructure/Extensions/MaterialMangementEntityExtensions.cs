using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Entities.Projects;
using Projects.Web.Models;

namespace Projects.Web.Infrastructure.Extensions
{

    public static class MaterialMangementEntityExtensions
    {
        public static void addMaterialPrice(this tbl_material_price MaterialMangement, MaterialpriceViewModel MaterialVM)
        {
            MaterialMangement.tenant_id = MaterialVM.tenant_id;
            MaterialMangement.project_id = MaterialVM.project_id;
            MaterialMangement.material_name = MaterialVM.material_name;
            MaterialMangement.material_description = MaterialVM.material_description;
            MaterialMangement.material_price = MaterialVM.material_price;
            MaterialMangement.unit_of_measurement = MaterialVM.unit_of_measurement;

        }
    }
}