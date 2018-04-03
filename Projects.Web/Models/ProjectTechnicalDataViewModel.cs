using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ProjectTechnicalDataViewModel
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string Project_Code { get; set; }
        public string Special_Mtrl_Requ_Chk { get; set; }
        public string Special_Mtrl_Requ { get; set; }
        public string Warranty_Period { get; set; }
        public string CE_Marking { get; set; }
        public string Insp_TPIA { get; set; }
        public string ASME_Code { get; set; }
        public string National_Board_Reg { get; set; }
        public string InspectonBy_CIB { get; set; }
        public string Comp_With_Loc_Reg { get; set; }
        public string Comp_With_Doc_To_Gost { get; set; }
        public string QAP_Approve { get; set; }
        public string Insp_by_Auth_Insp { get; set; }
        public string Insp_by_Accep_Client { get; set; }
        public string Concession_Requeist_Client { get; set; }
        public string CompID { get; set; }
        public string ProjectCodeConstruction { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}