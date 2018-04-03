using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class PartListViewModel
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string Part_List_No { get; set; }
        public string Part_List_Name { get; set; }
        public string CompID { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}