package pl.masi.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.MetricBean;
import pl.masi.entities.USABILITY_DATA;
import pl.masi.repositories.MetricRepository;
import pl.masi.services.interfaces.IMetricService;

@Service
@Transactional
public class MetricService  implements IMetricService {

    @Autowired
    private MetricRepository metricRepository;

    @Override
    public void add(MetricBean metricBean) {
        USABILITY_DATA newData = USABILITY_DATA.builder()
                .IP(metricBean.getIp())
                .BROWSER(metricBean.getBrowser())
                .USERNAME(metricBean.getUsername())
                .M_ID(metricBean.getM_id())
                .SAVETIME(metricBean.getSavetime())
                .RES_W(metricBean.getRes_w())
                .RES_H(metricBean.getRes_h())
                .MC(metricBean.getMc())
                .TIME(metricBean.getTime())
                .DIST(metricBean.getDist())
                .FAIL(metricBean.isFail())
                .ERROR(metricBean.getError())
                .build();
        metricRepository.save(newData);
    }

}
