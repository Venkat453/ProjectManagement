using System;
using System.Collections.Generic;
using System.Linq;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data;
using ClosedXML.Excel;
using System.IO;
using System.Reflection;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/Dashboard")]
    public class DashboardController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_employee> _EmployeeRepository;
        public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;
        public readonly IEntityBaseRepository<tbl_chartsorder> _chartorderRepository;


        public DashboardController(IEntityBaseRepository<tbl_settings> settingsRepository,
                IEntityBaseRepository<tbl_employee> EmployeeRepository,
                IEntityBaseRepository<tbl_chartsorder> ChartorderRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _EmployeeRepository = EmployeeRepository;
            _settingsRepository = settingsRepository;
            _chartorderRepository = ChartorderRepository;
        }

        [HttpGet]
        [Route("ScWiseTotalEmployesList/{project_id:int}")]
        public IHttpActionResult ScWiseTotalEmployesList(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var TotalEmployeslist = (from lb in contextObj.labourset.Where(x => x.project_id == project_id)
                                     select new
                                     {
                                         subcontractor_id = lb.subcontractor_id,
                                         master_emp_id = lb.master_emp_id,
                                         name = lb.name
                                     }).Concat(from dr in contextObj.vehicleset.Where(x => x.project_id == project_id)
                                               select new
                                               {
                                                   subcontractor_id = dr.subcontractor_id,
                                                   master_emp_id = dr.master_emp_id,
                                                   name = dr.driver_name
                                               });
            var groupList = from tlst in TotalEmployeslist
                            group tlst by tlst.subcontractor_id into grps
                            select new
                            {
                                Key = grps.Key,
                                Values = grps,
                                Total = grps.Count()
                            };
            return Ok(groupList);
        }

        [HttpGet]
        [Route("InductionDoneList/{project_id:int}")]
        public IHttpActionResult InductionDoneList(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var TotalEmployeslist = (from lb in contextObj.labourset.Where(x => x.project_id == project_id)
                                     select new
                                     {
                                         subcontractor_id = lb.subcontractor_id,
                                         master_emp_id = lb.master_emp_id,
                                         name = lb.name
                                     }).Concat(from dr in contextObj.vehicleset.Where(x => x.project_id == project_id)
                                               select new
                                               {
                                                   subcontractor_id = dr.subcontractor_id,
                                                   master_emp_id = dr.master_emp_id,
                                                   name = dr.driver_name
                                               });
            var indlist = (from temp in TotalEmployeslist
                           join ind in contextObj.inductionset on temp.master_emp_id equals ind.master_emp_id
                           select new
                           {
                               subcontractor_id = temp.subcontractor_id,
                               master_emp_id = temp.master_emp_id,
                               name = temp.name
                           });

            var indgroupList = from tilst in indlist
                               group tilst by tilst.subcontractor_id into grps
                               select new
                               {
                                   Key = grps.Key,
                                   Values = grps,
                                   Total = grps.Count()
                               };
            return Ok(indgroupList);
        }

        [HttpGet]
        [Route("JunctionWiseWorkProgress/{project_id:int}/{ps_id:int}")]
        public IHttpActionResult JunctionWiseWorkProgress(HttpRequestMessage request, int project_id, int ps_id)
        {
            DBConnect contextObj = new DBConnect();
            if (ps_id == 0)
            {
                var workprogress = (from wp in contextObj.workprogressset.Where(x => x.project_id == project_id)
                                    group wp by wp.junction_id into g
                                    select new
                                    {
                                        junction_name = contextObj.junctionset.Where(x => x.id == g.Key).Select(x => x.junction_name),
                                        completedwork = g.Sum(p => p.completed),//(g.Sum(p => p.completed)/g.Sum(p=>p.total))*100
                                        totalwork = g.Sum(p => p.total)
                                        //workprogressPercnt= ((g.Sum(p => p.completed)) /( g.Sum(p => p.total))) * 100
                                    }).Where(x=>x.completedwork > 0);
                return Ok(workprogress);
            }
            else
            {
                var workprogress = (from wp in contextObj.workprogressset.Where(x => x.project_id == project_id).Where(p => p.ps_id == ps_id)
                                    group wp by wp.junction_id into g
                                    select new
                                    {
                                        junction_name = contextObj.junctionset.Where(x => x.id == g.Key).Select(x => x.junction_name),
                                        completedwork = g.Sum(p => p.completed),//(g.Sum(p => p.completed)/g.Sum(p=>p.total))*100
                                        totalwork = g.Sum(p => p.total)
                                        //workprogressPercnt= ((g.Sum(p => p.completed)) /( g.Sum(p => p.total))) * 100
                                    }).Where(x => x.completedwork > 0);
                return Ok(workprogress);
            }
        }

        [HttpGet]
        [Route("SubContractorWiseIndentcost/{project_id:int}")]
        public IHttpActionResult SubContractorWiseIndentcost(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            //var SubcontractorIndentCost = (from id in contextObj.indentdetails
            //                               join ih in contextObj.indentheader on id.indent_no equals ih.indent_no
            //                               join sc in contextObj.subcontractorset on ih.SubContractor_id equals sc.id
            //                               select new
            //                               {
            //                                   materialCost = id.released_material_Cost,
            //                                   subcontractorName = sc.subcontractor_name
            //                               });

            var SubcontractorIndentCost = (from id in contextObj.indentdetails
                                           group id by id.indent_no into g
                                           select new
                                           {
                                               totalCost = g.Sum(c => c.released_material_Cost),
                                               indentno = g.Key
                                           } into idnt
                                           join ih in contextObj.indentheader on idnt.indentno equals ih.indent_no
                                           select new
                                           {
                                               ttlCost = idnt.totalCost,
                                               idntNo = idnt.indentno,
                                               sc_id = ih.SubContractor_id
                                           });
            var xCost = (from scic in SubcontractorIndentCost
                         group scic by scic.sc_id into g2
                         select new
                         {
                             sc_name = contextObj.subcontractorset.Where(x => x.id == g2.Key).Select(X => X.subcontractor_name),
                             xttlcost = g2.Sum(x => x.ttlCost)
                         }


                );
            return Ok(xCost);
        }

        [HttpGet]
        [Route("IndentsStatusList/{project_id:int}")]
        public IHttpActionResult IndentsStatusList(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var approved = from ins in contextObj.IndentStatus
                           select new
                           {
                               name = "Approved",
                               scount = contextObj.IndentStatus.Count(x => x.indentstatus == "Approved")
                           };
            var rejected = from ins in contextObj.IndentStatus
                           select new
                           {
                               name = "Rejected",
                               scount = contextObj.IndentStatus.Count(x => x.indentstatus == "Rejected")
                           };
            var pending = from ins in contextObj.IndentStatus
                          select new
                          {
                              name = "Pending",
                              scount = contextObj.IndentStatus.Count(x => x.indentstatus == "Pending")
                          };
            var created = from ins in contextObj.IndentStatus
                          select new
                          {
                              name = "Created",
                              scount = contextObj.IndentStatus.Count(x => x.indentstatus == "Created")
                          };
            //var given = from ins in contextObj.IndentStatus
            //              select new
            //              {
            //                  name = "Given",
            //                  scount = contextObj.IndentStatus.Count(x => x.indentstatus == "Given")
            //              };
            var allContct = approved.Concat(rejected).Concat(pending).Concat(created);
            //var approved = contextObj.IndentStatus.Count(x => x.indentstatus == "Approved");
            //var rejected = contextObj.IndentStatus.Count(x => x.indentstatus == "Rejected");
            //var pending = contextObj.IndentStatus.Count(x => x.indentstatus == "Pending");
            //var created = contextObj.IndentStatus.Count(x => x.indentstatus == "Created");
            //var indentstatuslist = new
            //{
            //    approved = approved.FirstOrDefault(),
            //    rejected = rejected.FirstOrDefault(),
            //    pending = pending.FirstOrDefault(),
            //    created = created.FirstOrDefault()
            //};

            var indentstatuslist = contextObj.IndentStatus.Where(x => x.project_id == project_id);
            return Ok(indentstatuslist);
        }

        [HttpGet]
        [Route("LabourTestCertificates/{project_id:int}")]
        public IHttpActionResult LabourTestCertificates(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var TestCertificatesList = (from lb in contextObj.labourset.Where(x => x.project_id == project_id)
                                        group lb by lb.subcontractor_id into g
                                        select new
                                        {
                                            sc_id = g.Key,
                                            sc_name = contextObj.subcontractorset.Where(s => s.id == g.Key).Select(X => X.subcontractor_name),
                                            medicalTestDone = g.Count(m => m.check_medical_certificate == true),
                                            medicalTestNotDone = g.Count(m => m.check_medical_certificate == false),
                                            eyeTestDone = g.Count(e => e.check_eye_certificate == true),
                                            eyeTestNotDone = g.Count(e => e.check_eye_certificate == false),
                                            aadhardone = g.Count(m => m.check_aadhar == true),
                                            aadharnotdone = g.Count(m => m.check_aadhar == false),
                                            bankdone = g.Count(m => m.check_bank == true),
                                            banknotdone = g.Count(m => m.check_bank == false)
                                        });

            return Ok(TestCertificatesList);
        }

        [HttpGet]
        [Route("WorkProgressVerifList/{project_id:int}")]
        public IHttpActionResult WorkProgressVerifList(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var TestCertificatesList = (from wv in contextObj.workverificationSet.Where(x => x.project_id == project_id)
                                        group wv by wv.junction_id into g
                                        select new
                                        {
                                            jn_id = g.Key,
                                            jn_name = contextObj.junctionset.Where(s => s.id == g.Key).Select(X => X.junction_name),
                                            approvedWork = g.Count(m => m.verification_status == 55),
                                            NotConfirmedWork = g.Count(m => m.verification_status == 57)

                                        }).Where(x => x.approvedWork > 0 || x.NotConfirmedWork > 0);

            return Ok(TestCertificatesList);
        }

        [HttpGet]
        [Route("SCwithTotalIndentCost/{project_id:int}")]
        public IHttpActionResult SCwithTotalIndentCost(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var SubcontractorIndentCost = (from ih in contextObj.indentheader.Where(x => x.project_id == project_id)
                                           join id in contextObj.indentdetails on ih.indent_no equals id.indent_no
                                           join ids in contextObj.IndentStatus on id.indent_no equals ids.indent_no
                                           select new
                                           {
                                               sc_id = ih.SubContractor_id,
                                               sc_name = contextObj.subcontractorset.Where(s => s.id == ih.SubContractor_id).Select(s => s.subcontractor_name),
                                               indent_no = ih.indent_no,
                                               material_name = id.material_name,
                                               indent_status = ids.indentstatus,
                                               material_cost = id.material_price,
                                               given_quantity = id.given_quantity
                                           }).Where(c => c.indent_status == "Given");

            var Total_Cost = (from scic in SubcontractorIndentCost
                              group scic by scic.sc_id into k
                              select new
                              {
                                  sc_id = k.Select(c => c.sc_id),
                                  sc_name = k.Select(c => c.sc_name),
                                  total_cost = k.Sum(c => c.material_cost)
                              }
                );
            return Ok(Total_Cost);
        }

        [HttpGet]
        [Route("SCTotalMaterials/{project_id:int}")]
        public IHttpActionResult SCTotalMaterials(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();

            var SubcontractorIndentDetails = (from ih in contextObj.indentheader.Where(x => x.project_id == project_id)
                                              join id in contextObj.indentdetails on ih.indent_no equals id.indent_no
                                              join ids in contextObj.IndentStatus on id.indent_no equals ids.indent_no
                                              select new
                                              {
                                                  sc_id = ih.SubContractor_id,
                                                  sc_name = contextObj.subcontractorset.Where(s => s.id == ih.SubContractor_id).Select(s => s.subcontractor_name),
                                                  indent_no = ih.indent_no,
                                                  material_name = id.material_name,
                                                  indent_status = ids.indentstatus,
                                                  material_cost = id.material_price,
                                                  given_quantity = id.given_quantity
                                              }).Where(c => c.indent_status == "Given");

            var Total_Materials_count = (from scid in SubcontractorIndentDetails
                                         group scid by scid.sc_id into k
                                         select new
                                         {
                                             sc_id = k.Select(c => c.sc_id),
                                             sc_name = k.Select(c => c.sc_name),
                                             total_given_quantity = k.Sum(c => c.given_quantity)
                                         }
                );
            return Ok(Total_Materials_count);
        }

        [HttpGet]
        [Route("SCWiseTotalMaterialsList/{project_id:int}")]
        public IHttpActionResult SCWiseTotalMaterialsList(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var SCWiseTotalmaterialsList = (from ih in contextObj.indentheader.Where(x => x.project_id == project_id)
                                            join id in contextObj.indentdetails on ih.indent_no equals id.indent_no
                                            join ids in contextObj.IndentStatus on id.indent_no equals ids.indent_no
                                            select new
                                            {
                                                sc_id = ih.SubContractor_id,
                                                sc_name = contextObj.subcontractorset.Where(s => s.id == ih.SubContractor_id).Select(s => s.subcontractor_name),
                                                indent_no = ih.indent_no,
                                                material_name = id.material_name,
                                                indent_status = ids.indentstatus,
                                                material_cost = id.material_price,
                                                given_quantity = id.given_quantity
                                            }
                                           ).Where(c => c.indent_status == "Given");

            var SCWiseMtrlWiseGivenQuantityList = (from STML in SCWiseTotalmaterialsList
                                                   group STML by new
                                                   {
                                                       STML.sc_id,
                                                       STML.material_name
                                                   } into g
                                                   select new
                                                   {
                                                       sc_id = g.Key.sc_id,
                                                       sc_name = g.Select(x => x.sc_name).FirstOrDefault(),
                                                       material_name = g.Key.material_name,
                                                       given_quantity = g.Sum(x => x.given_quantity)
                                                   }
                 );
            return Ok(SCWiseMtrlWiseGivenQuantityList);
        }

        [HttpGet]
        [Route("IndentStatusWiseMaterialsList/{project_id:int}")]
        public IHttpActionResult IndentStatusWiseMaterialsList(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var SCWiseIndentmaterialsList = (from ih in contextObj.indentheader.Where(x => x.project_id == project_id)
                                            join id in contextObj.indentdetails on ih.indent_no equals id.indent_no
                                            join ids in contextObj.IndentStatus on id.indent_no equals ids.indent_no
                                            select new
                                            {
                                                sc_id = ih.SubContractor_id,
                                                sc_name = contextObj.subcontractorset.Where(s => s.id == ih.SubContractor_id).Select(s => s.subcontractor_name),
                                                indent_no = ih.indent_no,
                                                material_name = id.material_name,
                                                indent_status = ids.indentstatus,
                                                material_cost = id.material_price,
                                                given_quantity = id.given_quantity
                                            }
                                           ).Where(c => c.indent_status == "Given");
            var KVRList1 = (from STML in SCWiseIndentmaterialsList
                         group STML by new
                         {
                             STML.sc_id,
                             STML.material_name
                         } into g
                         select new
                         {
                             sc_id = g.Key.sc_id,
                             sc_name = g.Select(x => x.sc_name).FirstOrDefault(),
                             material_name = g.Key.material_name,
                             indent_no = g.Select(x => x.indent_no),
                             given_quantity = g.Select(x => x.given_quantity),
                         }
                );
            return Ok(KVRList1);
        }

        public string GetBase64File()
        {
            DBConnect contextObj = new DBConnect();
            var myList = (from s in contextObj.subcontractorset
                          select new
                          {
                              sc_id = s.id,
                              sc_name = s.subcontractor_name,
                              sc_project = s.project_id,
                              sc_company = s.company_name,
                              sc_regno = s.reg_No,
                              sc_contactno = s.current_contact_number
                          }).ToList();

            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Sample Sheet");
            worksheet.Cell("A2").InsertData(myList);

            PropertyInfo[] properties = myList.First().GetType().GetProperties();
            List<string> headerNames = properties.Select(prop => prop.Name).ToList();
            for (int i = 0; i < headerNames.Count; i++)
            {
                worksheet.Cell(1, i + 1).Value = headerNames[i];
                worksheet.Cell(1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                worksheet.Cell(1, i + 1).Style.Font.Bold = true;
                worksheet.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
                worksheet.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.DodgerBlue;
            }

            MemoryStream fs = new MemoryStream();
            workbook.SaveAs(fs);
            fs.Position = 0;

            Byte[] bytes = fs.ToArray();
            String file = Convert.ToBase64String(bytes);
            return file;
        }


        //[HttpGet]
        //[Route("GetPdfFile")]
        //public string GetPdfFile()
        //{
        //    DBConnect contextObj = new DBConnect();
        //    var myList = (from s in contextObj.subcontractorset
        //                  select new
        //                  {
        //                      sc_id = s.id,
        //                      sc_name = s.subcontractor_name,
        //                      sc_project = s.project_id,
        //                      sc_company = s.company_name,
        //                      sc_regno = s.reg_No,
        //                      sc_contactno = s.current_contact_number
        //                  }).ToList();
        //    MemoryStream ms = new MemoryStream();
        //    Document document = new Document(PageSize.A4, 25, 25, 30, 30);
        //    PdfWriter writer = PdfWriter.GetInstance(document, ms);
        //    document.Open();
        //    document.Add(new Paragraph("Hello World"));
        //    document.Close();
        //    writer.Close();
        //    ms.Close();
        //    Byte[] bytes = ms.ToArray();
        //    String file = Convert.ToBase64String(bytes);
        //    return file;
        //}

        [HttpPost]
        [Route("SaveChartOrder")]
        public HttpResponseMessage SaveChartOrder(HttpRequestMessage request, ChartOrderViewModel chartorder)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    tbl_chartsorder newChartorder = new tbl_chartsorder();
                    newChartorder.addChartorder(chartorder);
                    _chartorderRepository.Add(newChartorder);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<ChartOrderViewModel>(HttpStatusCode.Created, chartorder);
                }
                return response;
            });
        }


        [HttpGet]
        [Route("GetChartOrderList/{user_id:int}")]
        public HttpResponseMessage GetChartOrderList(HttpRequestMessage request, int user_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Chartorderlist = _chartorderRepository.GetAll().Where(x => x.userid == user_id); 
                IEnumerable<ChartOrderViewModel> chartordervm = Mapper.Map<IEnumerable<tbl_chartsorder>, IEnumerable<ChartOrderViewModel>>(Chartorderlist);
                response = request.CreateResponse<IEnumerable<ChartOrderViewModel>>(HttpStatusCode.OK, chartordervm);
                return response;
            });
        }


        [HttpPost]
        [Route("UpdateChartOrderList")]
        public HttpResponseMessage UpdateChartOrderList(HttpRequestMessage request, ChartOrderViewModel chartorder)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var existingOrder = _chartorderRepository.GetAll().Where(x=>x.userid==chartorder.userid).FirstOrDefault();
                    existingOrder.userid = chartorder.userid;
                    existingOrder.user_name = chartorder.user_name;
                    existingOrder.charts_order = chartorder.charts_order;
                    _chartorderRepository.Edit(existingOrder);
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });
        }

    }
}