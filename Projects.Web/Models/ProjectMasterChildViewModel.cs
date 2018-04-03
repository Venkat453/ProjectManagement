using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ProjectMasterChildViewModel
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string Project_Code { get; set; }
        public string Project_Equp_Name { get; set; }
        public string CompID { get; set; }
        public string Maker_No { get; set; }
        public string APG_No { get; set; }
        public string APG_Name { get; set; }
        public string Full_Project_Code { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}