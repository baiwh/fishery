package com.geariot.platform.fishery.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.geariot.platform.fishery.dao.WXUserDao;
import com.geariot.platform.fishery.entities.Company;
import com.geariot.platform.fishery.entities.WXUser;
import com.geariot.platform.fishery.utils.Constants;
import com.geariot.platform.fishery.utils.QueryUtils;
@Repository
public class WXUserDaoImpl implements WXUserDao {

	@Autowired
	private SessionFactory sessionFactory;
	
	private Session getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	@Override
	public WXUser findUserByOpenId(String openId) {
		String hql = "from WXUser where openId= :openId ";
		WXUser wxuser= (WXUser)getSession().createQuery(hql).setString("openId", openId).setCacheable(Constants.SELECT_CACHE).uniqueResult();
		return wxuser;
	}

	@Override
	public WXUser findUserByPhone(String phone) {
		String hql = "from WXUser where phone= :phone ";
		WXUser wxuser= (WXUser) getSession().createQuery(hql).setString("phone", phone).setCacheable(Constants.SELECT_CACHE).uniqueResult();
		return wxuser;
	}

	@Override
	public void deleteUser(int WXUserId) {
		String hql = "delete from WXUser where Id in :Id";
		this.getSession().createQuery(hql).setInteger("Id",WXUserId).executeUpdate();

	}

	@Override
	public void updateUser(WXUser oldWXUser) {
		this.getSession().merge(oldWXUser);

	}

	@Override
	public void save(WXUser wxUser) {
		this.getSession().save(wxUser);

	}

	@Override
	public WXUser findUserById(int Id) {
		String hql = "from WXUser where Id= :Id ";
		WXUser wxuser= (WXUser) getSession().createQuery(hql).setInteger("Id", Id).setCacheable(Constants.SELECT_CACHE).uniqueResult();
		return wxuser;
	}

	@Override
	public List<WXUser> queryList(String name, int page, int number) {
		QueryUtils qutils = new QueryUtils(getSession(), "from WXUser");
		Query query = qutils.addStringLike("name", name)
		.setFirstResult(page)
		.setMaxResults(number)
		.getQuery();
		return query.list();
	}

	@Override
	public long getQueryCount(String name) {
		QueryUtils qutils = new QueryUtils(getSession(), "select count(*) from WXUser");
		Query query = qutils.addStringLike("name", name)
		.getQuery();
		return (long) query.uniqueResult();
	}



}