using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_project_master : IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
        public string Project_Client { get; set; }
        public Nullable<System.DateTime> Project_DeliveryDate { get; set; }
        public string CompID { get; set; }
        public string Project_Description { get; set; }
        public string Project_Equp_Name { get; set; }
        public string Maker_No { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}
