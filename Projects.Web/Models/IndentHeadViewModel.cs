using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class IndentHeadViewModel: IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string indent_no { get; set; }
        public int SubContractor_id { get; set; }
       // public string material { get; set; }
        public string authorized_by { get; set; }
        public string recieved_by { get; set; }
        public string recieved_from { get; set; }
        public DateTime date_recieved { get; set; }
        public DateTime date_required { get; set; }
        public byte[] indent_encode { get; set; }
        public string indent_encode_file_type { get; set; }
        public List<IndentDetailsViewModel> indentdetails { get; set; }
    }
}