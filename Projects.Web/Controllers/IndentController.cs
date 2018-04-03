using AutoMapper;
using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace Projects.Web.Controllers
{
    public class updtIndentStatus
    {
        public int id { get; set; }
        public string indentstatus { get; set; }
    }
    public class updateIndentDetails
    {
        public int id { get; set; }
        public string indent_no { get; set; }
        public string material_name { get; set; }
        public int quantity { get; set; }
        public int material_price { get; set; }
        public int total_price { get; set; }
        public int given_quantity { get; set; }
        public bool material_released_status { get; set; }
        public float released_material_Cost { get; set; }
        public DateTime material_released_date { get; set; }
    }



    [RoutePrefix("api/indent")]
    public class IndentController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_indent_header> _indentheaderRepository;
        public readonly IEntityBaseRepository<tbl_project_master> _projectmasterRepository;
        public readonly IEntityBaseRepository<tbl_material_price> _materialpriceRepository;
        public readonly IEntityBaseRepository<tbl_indent_details> _indentdetailsRepository;
        public readonly IEntityBaseRepository<tbl_indentstatus> _indentstatusRepository;
        public IndentController(IEntityBaseRepository<tbl_indent_header> indentheaderRepository,
            IEntityBaseRepository<tbl_project_master> projectmasterRepository,
            IEntityBaseRepository<tbl_material_price> materialpriceRepository,
            IEntityBaseRepository<tbl_indent_details> indentdetailsRepository,
             IEntityBaseRepository<tbl_indentstatus> indentstatusRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _indentheaderRepository = indentheaderRepository;
            _projectmasterRepository = projectmasterRepository;
            _materialpriceRepository = materialpriceRepository;
            _indentdetailsRepository = indentdetailsRepository;
            _indentstatusRepository = indentstatusRepository;
        }

        [HttpPost]
        [Route("SaveIndent")]
        public HttpResponseMessage SaveIndent(HttpRequestMessage request, IndentHeadViewModel indent)
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

                    var newindentheader = new tbl_indent_header()
                    {
                        tenant_id = indent.tenant_id,
                        indent_no = indent.indent_no,
                        SubContractor_id = indent.SubContractor_id,
                        project_id = indent.project_id,
                        authorized_by = indent.authorized_by,
                        recieved_by = indent.recieved_by,
                        recieved_from = indent.recieved_from,
                        indent_encode = indent.indent_encode,
                        indent_encode_file_type = indent.indent_encode_file_type,
                        date_recieved = indent.date_recieved,
                        date_required = indent.date_required
                    };

                    for (int i = 0; i < indent.indentdetails.Count; i++)
                    {
                        var newIndentDetails = new tbl_indent_details();
                        newIndentDetails.AddindentDetails(indent.indentdetails.ToList()[i]);
                        _indentdetailsRepository.Add(newIndentDetails);
                    }

                    var newIndentStatus = new tbl_indentstatus()

                    {
                        indent_id = indent.id,
                        tenant_id = indent.tenant_id,
                        project_id = indent.project_id,
                        indent_no = indent.indent_no,
                        SubContractor_id = indent.SubContractor_id,
                        recieved_by = indent.recieved_by,
                        date_recieved = indent.date_recieved,
                        date_required = indent.date_required,
                        indentstatus = "Created"
                    };
                    
                    _indentheaderRepository.Add(newindentheader);
                    _indentstatusRepository.Add(newIndentStatus);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<IndentHeadViewModel>(HttpStatusCode.Created, indent);
                }
                return response;
            });
        }


        [AllowAnonymous]
        [Route("GetIndentList")]
        public IHttpActionResult GetIndentList(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();
            var IndentList = _indentstatusRepository.GetAll();

            return Ok(IndentList);
        }

        [HttpGet]
        [Route("GetProjectMasterList/{tenant_id:int}")]
        public HttpResponseMessage GetProjectMasterList(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var projectmaster = _projectmasterRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<ProjectMasterViewModel> projectmastervm = Mapper.Map<IEnumerable<tbl_project_master>, IEnumerable<ProjectMasterViewModel>>(projectmaster);
                response = request.CreateResponse<IEnumerable<ProjectMasterViewModel>>(HttpStatusCode.OK, projectmastervm);
                return response;

            });
        }


        [Route("GetMaterialList/{material_id:int}")]
        public HttpResponseMessage GetMaterialList(HttpRequestMessage request, int? material_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var masterdetails = _materialpriceRepository.GetAll().Where(x => x.id == material_id);
                IEnumerable<MaterialpriceViewModel> ProjectVm = Mapper.Map<IEnumerable<tbl_material_price>, IEnumerable<MaterialpriceViewModel>>(masterdetails);
                response = request.CreateResponse<IEnumerable<MaterialpriceViewModel>>(HttpStatusCode.OK, ProjectVm);
                return response;
            });

        }

        [HttpGet]
        [Route("GetIndent/{tenant_id:int}")]
        public HttpResponseMessage GetIndent(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var indent = _indentheaderRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<IndentHeadViewModel> indentvm = Mapper.Map<IEnumerable<tbl_indent_header>, IEnumerable<IndentHeadViewModel>>(indent);
                response = request.CreateResponse<IEnumerable<IndentHeadViewModel>>(HttpStatusCode.OK, indentvm);
                return response;

            });
        }

        [HttpGet]
        [Route("GetIndentByProjId/{project_id:int}")]
        public HttpResponseMessage GetIndentByProjId(HttpRequestMessage request,int project_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var indent = _indentheaderRepository.GetAll().Where(x=>x.project_id==project_id);
                IEnumerable<IndentHeadViewModel> indentvm = Mapper.Map<IEnumerable<tbl_indent_header>, IEnumerable<IndentHeadViewModel>>(indent);
                response = request.CreateResponse<IEnumerable<IndentHeadViewModel>>(HttpStatusCode.OK, indentvm);
                return response;

            });
        }

        [HttpGet]
        [Route("GetIndentdetails/{tenant_id:int}")]
        public HttpResponseMessage GetIndentdetails(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var indent = _indentdetailsRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<IndentDetailsViewModel> indentvm = Mapper.Map<IEnumerable<tbl_indent_details>, IEnumerable<IndentDetailsViewModel>>(indent);
                response = request.CreateResponse<IEnumerable<IndentDetailsViewModel>>(HttpStatusCode.OK, indentvm);
                return response;

            });
        }

        [HttpGet]
        [Route("GetIndentStatus/{tenant_id:int}")]
        public HttpResponseMessage GetIndentStatus(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var indentStatus = _indentstatusRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<IndentStatusViewModel> indentStatusvm = Mapper.Map<IEnumerable<tbl_indentstatus>, IEnumerable<IndentStatusViewModel>>(indentStatus);
                response = request.CreateResponse<IEnumerable<IndentStatusViewModel>>(HttpStatusCode.OK, indentStatusvm);
                return response;
            });
        }

        [HttpGet]
        [Route("WarehouseDetailsList")]
        public IHttpActionResult WarehouseDetailsList(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();
            var WDList = (from id in contextObj.indentdetails
                          join ih in contextObj.indentheader on id.indent_no equals ih.indent_no
                          join ist in contextObj.IndentStatus on ih.indent_no equals ist.indent_no
                          select new
                                {
                                    id = id.id,
                                    indent_no = id.indent_no,
                                    created_date = ih.date_recieved,
                                    material_name = id.material_name,
                                    material_price = id.material_price,
                                    raised_quantity = id.quantity,
                                    raised_total_price = id.total_price,
                                    raised_status = ist.indentstatus,
                                    given_quantity = id.given_quantity,
                                    released_material_Cost = id.released_material_Cost,
                                    material_released_status = id.material_released_status,
                                    material_released_date = id.material_released_date,
                                    SubContractor_id = ih.SubContractor_id,
                                });
            return Ok(WDList);
        }

        [HttpPost]
        [Route("SaveMaterials")]
        public HttpResponseMessage SaveMaterials(HttpRequestMessage request, IndentDetailsViewModel indent)
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
                    tbl_indent_details newProject = new tbl_indent_details();
                    newProject.AddindentDetails(indent);
                    _indentdetailsRepository.Add(newProject);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<IndentDetailsViewModel>(HttpStatusCode.Created, indent);
                }
                return response;
            });
        }

        [HttpPost]
        [Route("SaveIndentStatus")]
        public HttpResponseMessage SaveIndentStatus(HttpRequestMessage request, IndentStatusViewModel indent)
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
                    tbl_indentstatus newStatus = new tbl_indentstatus();
                    newStatus.AddindentStatus(indent);
                    _indentstatusRepository.Add(newStatus);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<IndentStatusViewModel>(HttpStatusCode.Created, indent);
                }
                return response;
            });
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("UpdateIndentStatus")]
        public HttpResponseMessage UpdateIndentStatus(HttpRequestMessage request, updtIndentStatus indstatus)
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
                    var existingUser = _indentstatusRepository.GetSingle(indstatus.id);

                    existingUser.indentstatus = indstatus.indentstatus;

                    // existingUser.assignedstatus = indstatus.indentstatus;


                    _indentstatusRepository.Edit(existingUser);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }

        [HttpPost]
        [Route("UpdateWarehouseDetails")]
        public HttpResponseMessage UpdateWarehouseDetails(HttpRequestMessage request, List<updateIndentDetails> indentDetails)
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
                    for (int i = 0; i < indentDetails.Count; i++)
                    {
                        var id = indentDetails[i].id;
                        var existingindentDetails = _indentdetailsRepository.GetSingle(id);
                        existingindentDetails.given_quantity = indentDetails[i].given_quantity;
                        existingindentDetails.released_material_Cost = indentDetails[i].released_material_Cost;
                        existingindentDetails.material_released_date = DateTime.Now;
                        existingindentDetails.material_released_status = indentDetails[i].material_released_status;

                        _indentdetailsRepository.Edit(existingindentDetails);

                        DBConnect contextObj = new DBConnect();
                        var indent = indentDetails[i].indent_no;
                        var myIndent = contextObj.IndentStatus.Where(u => u.indent_no == indent).FirstOrDefault();


                        var existingindentStatus = _indentstatusRepository.GetSingle(myIndent.id);
                        existingindentStatus.indentstatus = "Given";
                        _indentstatusRepository.Edit(existingindentStatus);

                        _unitOfWork.Commit();

                        response = request.CreateResponse(HttpStatusCode.OK);
                    }

                }

                return response;
            });
        }

        [HttpGet]
        [Route("GetTotalIndentList/{tenant_id:int}/{projectid:int}")]
        public IHttpActionResult GetTotalIndentList(HttpRequestMessage request, int tenant_id, int projectid)
        {
            DBConnect contextObj = new DBConnect();
            var indentlist = (from ind in contextObj.indentheader.Where(ind => ind.tenant_id == tenant_id && ind.project_id == projectid).ToList()
                                 join p in contextObj.ProjectMaster on ind.project_id equals p.id
                                 join sub in contextObj.subcontractorset on ind.SubContractor_id equals sub.id into pstns
                                 from x in pstns.DefaultIfEmpty()
                                 select new
                                 {
                                     id=ind.id,
                                     project_id = p.id,
                                     project_name = p.project_name,
                                     subcontractor_id=x.id,
                                     subcontractor_name=x.subcontractor_name,
                                     Indent_no=ind.indent_no,
                                     date_required=ind.date_required,
                                     date_received=ind.date_recieved,
                                     indent_status=contextObj.IndentStatus.Where(y=>y.indent_no==ind.indent_no).Select(y=>y.indentstatus).FirstOrDefault()
                                 });
            return Ok(indentlist);
        }


    }
}