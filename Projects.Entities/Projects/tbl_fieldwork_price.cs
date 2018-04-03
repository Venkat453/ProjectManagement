using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_fieldwork_price : IEntityBase
    {

        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string fieldwork_name { get; set; }
        public string fieldwork_description { get; set; }
        public int unit_of_measurement { get; set; }
        public string fieldwork_price { get; set; }
      




    }
}
