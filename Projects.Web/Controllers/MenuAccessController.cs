using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Data.Extensions;
using Projects.Entities.Membership; 
using Projects.Web.Models;
using Projects.Web.Infrastructure.Core;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure;
using Projects.Services;
using System.Data.Entity.Infrastructure;
using System.Web;
using Projects.Data;
using Projects.Entities.MasterData;
using System.Collections;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/MenuAccess")]
    public class MenuAccessController : ApiControllerBase
    {
        private readonly IMembershipService _membershipService;
        public readonly IEntityBaseRepository<tbl_user> _userRepository;
        private readonly IEntityBaseRepository<tbl_menu> _menuRepository;
        public readonly IEntityBaseRepository<tbl_menu_access> _menuaccessRepository;

        public MenuAccessController(IMembershipService membershipService,
            IEntityBaseRepository<tbl_user> userRepository,
            IEntityBaseRepository<tbl_menu> menuRepository,
            IEntityBaseRepository<tbl_menu_access> menuaccessRepository,
            IEntityBaseRepository<tbl_error> _errorReposity,
            IUnitOfWork _iUnitOfWork) : base(_errorReposity, _iUnitOfWork)
        {
            _membershipService = membershipService;
            _userRepository = userRepository;
            _menuRepository = menuRepository;
            _menuaccessRepository = menuaccessRepository;
        }

        [Route("GetMenu")]
        public HttpResponseMessage GetMenu(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                var menu = _menuRepository.GetAll().OrderBy(x => x.menu_order);
                IEnumerable<MenuViewModel> Menuvm = Mapper.Map<IEnumerable<tbl_menu>, IEnumerable<MenuViewModel>>(menu);
                response = request.CreateResponse<IEnumerable<MenuViewModel>>(HttpStatusCode.OK, Menuvm);
                return response;
            });
        }

        [Route("GetMenuList/{userid:int}")]
        public IHttpActionResult GetMenuList(HttpRequestMessage request, int userid)
        {
            var menuitems = (from ma in _menuaccessRepository.GetAll().AsQueryable()
                             join m in _menuRepository.GetAll().AsQueryable() on ma.menu_id equals m.id
                             where ma.user_id == userid && ma.is_active == true
                             select new
                             {
                                 id = m.id,
                                 name = m.name,
                                 url = m.url,
                                 icon = m.icon,
                                 tooltip = m.tooltip,
                                 menu_order = m.menu_order,
                                 category = m.category,
                                 menu_for = m.menu_for,
                                 parent_menu = m.parent_menu,
                                 is_access = ma.is_active
                             }).OrderBy(x => x.menu_order);

            return Ok(menuitems);
        }

        [Route("GetMenuForAccess/{tenantid:int}")]
        public IHttpActionResult GetMenuForAccess(HttpRequestMessage request, int tenantid)
        {
            var menuitems = (from ma in _menuaccessRepository.GetAll().AsQueryable()
                             join m in _menuRepository.GetAll().AsQueryable() on ma.menu_id equals m.id
                             join u in _userRepository.GetAll().AsQueryable() on ma.user_id equals u.id
                             where ma.tenant_id == tenantid && ma.is_active == true

                             select new
                             {
                                 id = m.id,
                                 menu_id = ma.menu_id,
                                 menu_name = m.name,
                                 parent_menu = m.parent_menu,
                                 userid = ma.user_id,
                                 tenant_id = ma.tenant_id,
                                 is_tenant = u.is_tenant,
                                 is_access = ma.is_active
                             });

            return Ok(menuitems);
        }

        [HttpPost]
        [Route("SaveMenuAccess")]
        public HttpResponseMessage SaveMenuAccess(HttpRequestMessage request, List<MenuAccessViewModel> userAccessList)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateResponse(HttpStatusCode.BadRequest, new { success = false });
                }
                else
                {
                    //Removing Menu Access
                    int tenantid = userAccessList[0].tenant_id;
                    int userid = userAccessList[0].user_id;

                    var rMenuAccess = _menuaccessRepository.GetAll().Where(x => x.tenant_id == tenantid && x.user_id == userid);
                    if (rMenuAccess != null)
                    {
                        foreach (var menu in rMenuAccess)
                        {
                            menu.is_active = false;
                            _menuaccessRepository.Edit(menu);
                        }
                    }

                    for (int i = 0; i < userAccessList.Count; i++)
                    {

                        var menuAccess = _menuaccessRepository.GetSingleMenuAccess(userAccessList[i].tenant_id, userAccessList[i].user_id, userAccessList[i].menu_id);
                        if (menuAccess == null)
                        {
                            //Add
                            var newAccess = new tbl_menu_access()
                            {
                                menu_id = userAccessList[i].menu_id,
                                user_id = userAccessList[i].user_id,
                                tenant_id = userAccessList[i].tenant_id,
                                is_active = true,
                            };
                            _menuaccessRepository.Add(newAccess);
                        }
                        else
                        {
                            //update
                            menuAccess.is_active = true;
                            _menuaccessRepository.Edit(menuAccess);
                        }
                        _unitOfWork.Commit();
                    }
                    response = request.CreateResponse(HttpStatusCode.OK, new { success = true });

                }
                return response;
            });

        }

        [Route("GetEmployeesList")]
        public IHttpActionResult GetEmployeesList(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();
            var EmployeesList = (from e in contextObj.EmployeeMaster
                                 select new
                                 {
                                     UserName = e.emp_name,
                                     Role = e.Designation
                                 }
                                 ).Concat(from s in contextObj.subcontractorset
                                          select new
                                          {
                                              UserName = s.subcontractor_name,
                                              Role = "Subcontractor"
                                          });
            return Ok(EmployeesList);
        }

    }
}