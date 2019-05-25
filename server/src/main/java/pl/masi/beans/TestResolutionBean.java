package pl.masi.beans;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResolutionBean {
    private String testName;
    private String username;
    private String date;
    private List<QuestionAnswerBean> questionAnswers;
}
