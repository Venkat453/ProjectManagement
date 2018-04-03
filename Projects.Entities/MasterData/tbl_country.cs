using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Projects.Entities.MasterData
{
    public class tbl_country : IEntityBase
    {

        [Key]
        public int id { get; set; }
        public string iso_code { get; set; }
        public string country_name { get; set; }
        public string capital { get; set; }
        public string country_code { get; set; }
        
        public virtual ICollection<tbl_state> state { get; set; }
    }
}
