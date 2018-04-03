using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_users_profiles: IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public string userid { get; set; }
        public string user_name { get; set; }
        public string domain { get; set; }
        public byte[] logo { get; set; }
        public string logo_image_type { get; set; }
        public string email { get; set; }
        public string contact_no { get; set; }
        public string alt_contact_no { get; set; }
    }
}
