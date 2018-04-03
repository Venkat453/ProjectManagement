using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_project_commercial_data : IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public string Project_Code { get; set; }
        public string Project_Clasificaton { get; set; }
        public string Project_Sector { get; set; }
        public string Project_Currency { get; set; }
        public string LDfor_Delyed_Deliveryfor_Equp { get; set; }
        public string LDfor_Delyed_Deliveryfor_Draw { get; set; }
        public string Mile_Stone { get; set; }
        public string Per_Payments { get; set; }
        public string TriggeringPoint { get; set; }
        public string CompID { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}
