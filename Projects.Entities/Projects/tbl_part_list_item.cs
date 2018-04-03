using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_part_list_item : IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public string Project_Code { get; set; }
        public string Maker_No { get; set; }
        public string Apg_No { get; set; }
        public string Apg_Name { get; set; }
        public string Partlist_No { get; set; }
        public string Part_Group { get; set; }
        public string Part_Sl_No { get; set; }
        public string Part_Name { get; set; }
        public string Part_Desription { get; set; }
        public string Part_variant { get; set; }
        public string Part_UOM { get; set; }
        public string Part_Spec_Id { get; set; }
        public string Part_Rm_Type { get; set; }
        public Nullable<decimal> Part_Rm_WThick { get; set; }
        public Nullable<decimal> Part_Rm_Density { get; set; }
        public string Part_Mtc_Cert { get; set; }
        public string Part_IBR_Cert { get; set; }
        public string Part_EN_Cert { get; set; }
        public string Part_RM_Code { get; set; }
        public Nullable<decimal> Part_Dia { get; set; }
        public Nullable<decimal> Part_Wt { get; set; }
        public Nullable<decimal> Part_Length { get; set; }
        public Nullable<decimal> Part_W2 { get; set; }
        public Nullable<decimal> Part_Fg_wt { get; set; }
        public Nullable<decimal> Part_Rm_Wt { get; set; }
        public Nullable<decimal> Part_D_Wt { get; set; }
        public string Part_Engg_Code { get; set; }
        public string CompId { get; set; }
        public string Version_No { get; set; }
        public Nullable<System.DateTime> Version_Date { get; set; }
        public string Version_Change { get; set; }
        public Nullable<decimal> Qty { get; set; }
        public Nullable<decimal> OD { get; set; }
        public string Part_Equipment_Name { get; set; }
        public string Status { get; set; }
        public string Drawing_NO { get; set; }
        public string PTS_NO { get; set; }
        public string Main_Drwaing_No { get; set; }
        public string Activity_Part_No { get; set; }
        public string Part_Spl_Notes { get; set; }
        public Nullable<decimal> Part_Dai_Finished { get; set; }
        public Nullable<decimal> Part_W2_Finished { get; set; }
        public Nullable<decimal> Part_OD_Finished { get; set; }
        public Nullable<decimal> Part_WThick_Finished { get; set; }
        public Nullable<decimal> Part_Length_Finished { get; set; }
        public string Material_Shape_RM { get; set; }
        public string Material_Shape_Finished { get; set; }
        public string Created_By { get; set; }
        public Nullable<System.DateTime> Created_On { get; set; }
        public string Modified_By { get; set; }
        public Nullable<System.DateTime> Modified_On { get; set; }
    }
}
