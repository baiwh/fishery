package com.geariot.platform.fishery.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.geariot.platform.fishery.dao.Sensor_DataDao;
import com.geariot.platform.fishery.entities.Sensor_Data;
import com.geariot.platform.fishery.model.ExcelData;
import com.geariot.platform.fishery.utils.QueryUtils;

@Repository
public class Sensor_DataDaoImpl implements Sensor_DataDao {
	@Autowired
	private SessionFactory sessionFactory;
	
	private Session getSession(){
		return sessionFactory.getCurrentSession();
	}
	
	@Override
	public Sensor_Data findDataByDeviceSns(String deviceSns) {
		
			QueryUtils queryUtils = new QueryUtils(getSession(), "from Sensor_Data");
			Query query = queryUtils.addString("device_sn", deviceSns).getQuery();
			return (Sensor_Data) query.uniqueResult();
		
	}

	@Override
	public List<ExcelData> getExcelData(String device_sn, Date startTime, Date endTime) {
		List<ExcelData> dataList = new ArrayList<>();
		String hql = "from Sensor_Data ";
		QueryUtils queryUtils = new QueryUtils(getSession(), hql);
		Query query = queryUtils.addString("device_sn", device_sn)
				.addDateInScope("receiveTime", startTime, endTime)
				.addOrderByDesc("receiveTime").getQuery();
				
		@SuppressWarnings("unchecked")
		List<Sensor_Data> list = query.list();   
		if( !list.isEmpty() ){
				for(Sensor_Data obj : list){  
					ExcelData data = new ExcelData();
					data.setSID(String.valueOf(obj.getId()));
					data.setDevice_sn(obj.getDevice_sn());
					data.setOxygen(String.valueOf(obj.getOxygen()));
					data.setpH_value(String.valueOf(obj.getpH_value()));
					data.setReceiveTime(obj.getReceiveTime());
					data.setWater_temperature(String.valueOf(obj.getWater_temperature()));
					dataList.add(data);
				}
			}   
		return dataList;
	}

}