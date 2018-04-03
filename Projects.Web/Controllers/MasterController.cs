using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.MasterData;
using Projects.Entities.Membership;
using Projects.Web.Models;
using Projects.Web.Infrastructure;
using Projects.Web.Infrastructure.Core;
using Projects.Services;
using System.Data.Entity.Infrastructure;
using System.Web;
using Projects.Data;
//using Projects.Entities.Projects;

namespace Projects.Web.Controllers
{
    
    public class RefData
    {
        public int id { get; set; }
        public string refvalue { get; set; }
        public string refdescription { get; set; }
    }

    [RoutePrefix("api/MasterData")]
    public class MasterController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_user> _usersRepository;
        private readonly IEntityBaseRepository<tbl_reference_master> _refmasterRepository;
        private readonly IEntityBaseRepository<tbl_country> _countryRepository;
        private readonly IEntityBaseRepository<tbl_state> _stateRepository;
        private readonly IEntityBaseRepository<tbl_city> _cityRepository;
        public readonly IEntityBaseRepository<tbl_login_track> _logintrackRepository;
        public MasterController(IEntityBaseRepository<tbl_user> usersRepository,
            IEntityBaseRepository<tbl_reference_master> refmasterRepository,
            IEntityBaseRepository<tbl_country> countryRepository,
            IEntityBaseRepository<tbl_state> stateRepository,
            IEntityBaseRepository<tbl_city> cityRepository,
            IEntityBaseRepository<tbl_login_track> logintrackRepository,
            IEntityBaseRepository<tbl_error> _errorReposity,
            IUnitOfWork _iUnitOfWork) : base(_errorReposity, _iUnitOfWork)
        {
            _usersRepository = usersRepository;
            _refmasterRepository = refmasterRepository;
            _countryRepository = countryRepository;
            _stateRepository = stateRepository;
            _cityRepository = cityRepository;
            _logintrackRepository = logintrackRepository;
        }

        [Route("GetUsersList")]
        public HttpResponseMessage GetUsersList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var tapCloudsUsers = _usersRepository.GetAll();
                IEnumerable<UsersViewModel> tapCloudsUsersvm = Mapper.Map<IEnumerable<tbl_user>, IEnumerable<UsersViewModel>>(tapCloudsUsers);
                response = request.CreateResponse<IEnumerable<UsersViewModel>>(HttpStatusCode.OK, tapCloudsUsersvm);
                return response;

            });

        }

        [HttpGet]
        [Route("GetReferenceMasterData/{groupid:int}")]
        public HttpResponseMessage GetReferenceMasterData(HttpRequestMessage request, int groupid)
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
                    DBConnect contextObj = new DBConnect();
                    if (groupid == 0)
                    {
                        var refmaster = _refmasterRepository.GetAll();
                        IEnumerable<referencemasterViewModel> RefMastervm = Mapper.Map<IEnumerable<tbl_reference_master>, IEnumerable<referencemasterViewModel>>(refmaster);
                        response = request.CreateResponse<IEnumerable<referencemasterViewModel>>(HttpStatusCode.OK, RefMastervm);
                    }
                    else
                    {
                        var refmaster = _refmasterRepository.GetAll().Where(x=> x.group_id == groupid);
                        IEnumerable<referencemasterViewModel> RefMastervm = Mapper.Map<IEnumerable<tbl_reference_master>, IEnumerable<referencemasterViewModel>>(refmaster);
                        response = request.CreateResponse<IEnumerable<referencemasterViewModel>>(HttpStatusCode.OK, RefMastervm);
                    }
                }
                return response;

            });

        }

        [Route("GetReferenceGroup")]
        public HttpResponseMessage GetRefGroupMaster(HttpRequestMessage request)
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
                    DBConnect contextObj = new DBConnect();
                    var refgroupmaster = (from r in contextObj.refgroup
                                          select new
                                          {
                                              id = r.id,
                                              groupid = r.group_id,
                                              refitem = r.reference_item
                                          });
                    response = request.CreateResponse(HttpStatusCode.OK, refgroupmaster);
                }
                return response;

            });

        }

        [HttpPost]
        [Route("UpdateRefMaster")]
        public HttpResponseMessage UpdateRefMaster(HttpRequestMessage request, RefData refdata)
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
                    var existingRefMaster = _refmasterRepository.GetSingle(refdata.id);
                    existingRefMaster.reference_value = refdata.refvalue;
                    existingRefMaster.description = refdata.refdescription;
                    _refmasterRepository.Edit(existingRefMaster);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }

        [Route("GetCountryList")]
        public HttpResponseMessage GetCountryList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var countries = _countryRepository.GetAll();
                IEnumerable<CountryViewModel> Countryvm = Mapper.Map<IEnumerable<tbl_country>, IEnumerable<CountryViewModel>>(countries);
                response = request.CreateResponse<IEnumerable<CountryViewModel>>(HttpStatusCode.OK, Countryvm);
                return response;

            });

        }

        [Route("GetStateList")]
        public HttpResponseMessage GetStateList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var states = _stateRepository.GetAll();
                IEnumerable<StatesViewModel> Statevm = Mapper.Map<IEnumerable<tbl_state>, IEnumerable<StatesViewModel>>(states);
                response = request.CreateResponse<IEnumerable<StatesViewModel>>(HttpStatusCode.OK, Statevm);
                return response;

            });
        }

        [Route("GetCityList")]
        public HttpResponseMessage GetCityList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var cities = _cityRepository.GetAll();
                IEnumerable<CityViewModel> Cityvm = Mapper.Map<IEnumerable<tbl_city>, IEnumerable<CityViewModel>>(cities);
                response = request.CreateResponse<IEnumerable<CityViewModel>>(HttpStatusCode.OK, Cityvm);
                return response;

            });
        }
    }
}
