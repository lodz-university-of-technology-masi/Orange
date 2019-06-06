package pl.masi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResolution implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    private Long id;

    @ManyToOne
    @JoinColumn
    private Test test;

    @JsonIgnore
    @OneToMany(cascade = { CascadeType.ALL } ,mappedBy = "testResolution")
    private List<QuestionAnswer> questionAnswers;

    @ManyToOne
    @JoinColumn
    private Account account;

    private Date date;

    private Boolean isChecked;
}
