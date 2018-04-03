using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Web.Models;
using Projects.Entities.Projects;
using Projects.Data.Repositories;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class PoliceStationEntityExtensions
    {
        public static void AddPolicestation(this tbl_policestation policestation, PoliceStationViewModel policestationVm)
        {
            policestation.tenant_id = policestationVm.tenant_id;
            policestation.project_id = policestationVm.project_id;
            policestation.ps_name = policestationVm.ps_name;
            policestation.ps_contact_person = policestationVm.ps_contact_person;
            policestation.contact_person_mobile_no = policestationVm.contact_person_mobile_no;
            policestation.created_date = DateTime.Now;
            policestation.created_by = policestationVm.created_by;
            policestation.modified_date = DateTime.Now;
            policestation.modified_by = policestationVm.modified_by;
        }
    }
}