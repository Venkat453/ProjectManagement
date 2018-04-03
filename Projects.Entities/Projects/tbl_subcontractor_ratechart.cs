using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_subcontractor_ratechart : IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }

        public int projectid { get; set; }

        public int subcontractor_id { get; set; }

        public int  fieldwork_id { get; set; }
        public string fieldwork_description { get; set; }

        public string unitofmeasurement { get; set; }

        public float price { get; set; }
    }
}
